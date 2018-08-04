class ChallengeOptionsService
  def self.find_for_user(user:)
    new(user).evaluate
  end

  def initialize(user)
    @user = user
    @next_performance = Performance.next
    @challenge_options = []
  end

  def evaluate # rubocop:disable Metrics/MethodLength
    return _result if @next_performance.nil?
    return _result unless @user.can_challenge_for_performance?(@next_performance)
    return _result unless @next_performance.window_open?
    query = _query(
      performance_id: @next_performance.id,
      buck_id: @user.buck_id,
      instrument: User.instruments[@user.instrument],
      part: User.parts[@user.part]
    )
    @challenge_options = _parse_challenge_options(ActiveRecord::Base.connection.exec_query(query)).sort_by do |option|
      # row is the raw enum value (integer) returned from the database
      option[:row] * 10 + option[:file]
    end
    _result
  end

  private

  def _result
    OpenStruct.new(
      challenge_options: @challenge_options,
      next_performance: @next_performance,
      user: @user
    )
  end

  def _parse_challenge_options(raw_challenge_options)
    column_index_hash = _get_column_index_hash(raw_challenge_options.columns)
    raw_challenge_options.rows.map { |user| _parse_challengeable_user(user, column_index_hash) }
  end

  # rubocop:disable Metrics/MethodLength
  def _parse_challengeable_user(user, column_index_hash)
    {
      buck_id: user[column_index_hash[:buck_id]],
      challenge_id: user[column_index_hash[:challenge_id]],
      challenge_type: user[column_index_hash[:challenge_type]],
      file: user[column_index_hash[:file]],
      first_name: user[column_index_hash[:first_name]],
      last_name: user[column_index_hash[:last_name]],
      members_in_challenge: user[column_index_hash[:members_in_challenge]],
      open_spot: user[column_index_hash[:open_spot]],
      row: user[column_index_hash[:row]]
    }
  end

  def _get_column_index_hash(raw_challengeable_user)
    {
      buck_id: raw_challengeable_user.index("buck_id"),
      challenge_id: raw_challengeable_user.index("challenge_id"),
      challenge_type: raw_challengeable_user.index("challenge_type"),
      file: raw_challengeable_user.index("file"),
      first_name: raw_challengeable_user.index("first_name"),
      last_name: raw_challengeable_user.index("last_name"),
      members_in_challenge: raw_challengeable_user.index("members_in_challenge"),
      open_spot: raw_challengeable_user.index("open_spot"),
      row: raw_challengeable_user.index("row")
    }
  end

  # rubocop:disable Style/FormatStringToken
  # This query retrieves all spots that are currently occupied by
  # members with the same part and instrument as the current user.
  # Additional information about the spot:
  # 1) Whether it has been challenged (if so, how many people have challenged it)
  # 2) Whether the spot is open or not (based on any discipline action the spot's current user has)
  # Those pieces of information will be presented to the user
  def _query(params)
    q = <<~SQL
      SELECT
        s.row,
        s.file,
        c.challenge_type,
        c.id as challenge_id,
        users_disciplines.buck_id,
        users_disciplines.first_name,
        users_disciplines.last_name,
        users_disciplines.open_spot,
        count(uc.id) AS members_in_challenge
      FROM spots AS s
      LEFT OUTER JOIN (
        SELECT *
        FROM challenges
        WHERE performance_id = %{performance_id}
      ) c ON s.id = c.spot_id
      JOIN (
        SELECT *
        FROM users
        LEFT OUTER JOIN (
          SELECT *
          FROM discipline_actions
          WHERE performance_id = %{performance_id}
        ) disciplines_for_performance
        ON users.buck_id = disciplines_for_performance.user_buck_id
        WHERE users.instrument = %{instrument}
        AND users.part = %{part}
        AND NOT users.buck_id = '%{buck_id}'
        AND users.active
      ) users_disciplines ON s.id = users_disciplines.current_spot_id
      LEFT OUTER JOIN user_challenges AS uc ON c.id = uc.challenge_id
      WHERE s.file < 13
      GROUP BY
        c.id,
        s.row,
        s.file,
        c.challenge_type,
        users_disciplines.first_name,
        users_disciplines.last_name,
        users_disciplines.open_spot,
        users_disciplines.buck_id
    SQL
    q % params
  end
  # rubocop:enable Style/FormatStringToken, Metrics/MethodLength
end
