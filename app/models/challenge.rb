class Challenge < ApplicationRecord # rubocop:disable Metrics/ClassLength
  # enums
  enum stage: {
    needs_comments: 0,
    done: 2
  }, _suffix: true
  enum challenge_type: %i[open_spot normal tri], _suffix: true

  # associations
  has_many :user_challenges, dependent: :destroy
  accepts_nested_attributes_for :user_challenges
  has_many :users, through: :user_challenges, inverse_of: :challenges
  belongs_to :spot
  belongs_to :performance

  # validations
  validates :performance, presence: true
  validates :challenge_type, presence: true
  validate :valid_normal_challenge
  validate :valid_open_spot_challenge
  validate :valid_tri_challenge
  validate :all_users_have_same_instrument_and_part
  validate :no_users_are_admin
  validate :unique_users_in_challenge
  validate :no_duplicate_challenged_spots
  validate :correct_row_for_challenge_type

  # scopes
  scope :with_users_and_spots, -> { includes(user_challenges: { user: :original_spot }) }
  scope :done, -> { where(stage: :done) }
  scope :needs_comments, -> { where(stage: :needs_comments) }
  scope :viewable_by_user, lambda { |user|
    if user.admin? || (user.director? && user.instrument_any?)
      with_users_and_spots
    elsif user.director?
      with_users_and_spots.where(users: { instrument: user.instrument })
    elsif user.squad_leader?
      safe_row = connection.quote(Spot.rows[user.original_spot.row])
      sql = <<~SQL
        SELECT DISTINCT c.id
          FROM challenges c
            JOIN spots challenge_spots on c.spot_id = challenge_spots.id
            JOIN user_challenges uc on uc.challenge_id = c.id
            JOIN users u on uc.user_buck_id = u.buck_id
            JOIN spots users_original_spots on users_original_spots.id = u.original_spot_id
          WHERE
            challenge_spots.row = #{safe_row} OR
            users_original_spots.row = #{safe_row};
      SQL
      with_users_and_spots.where(id: find_by_sql(sql))
    else
      none
    end
  }
  scope :evaluable, ->(user) { viewable_by_user(user).needs_comments }
  scope :completed, ->(user) { viewable_by_user(user).done }

  def full?
    return true if normal_challenge_type? && users.length == 2
    return true if open_spot_challenge_type? && users.length == 2
    return true if tri_challenge_type? && users.length == 3
    false
  end

  def enough_users?
    return true if normal_challenge_type? && users.length == 2
    return true if open_spot_challenge_type? && users.length >= 1
    return true if tri_challenge_type? && users.length == 3
    false
  end

  def required_user_challenge_places # rubocop:disable Metrics/PerceivedComplexity, Metrics/MethodLength
    if normal_challenge_type?
      UserChallenge.places.slice(:first, :second).values
    elsif open_spot_challenge_type? && !full?
      UserChallenge.places.slice(:first).values
    elsif open_spot_challenge_type? && full?
      UserChallenge.places.slice(:first, :second).values
    elsif tri_challenge_type?
      UserChallenge.places.slice(:first, :second, :third).values
    else
      raise I18n.t!('errors.unexpected_value', variable_name: 'challenge_type', value: type)
    end
  end

  # rows that are allowed to have a tri challenge associated with it
  def self.tri_challenge_rows
    [:j]
  end

  private

  def valid_normal_challenge
    return if open_spot_challenge_type? || tri_challenge_type?
    return if users.length == 2
    errors.add(:users, 'only two users are allowed in a normal challenge')
  end

  def valid_open_spot_challenge
    return if normal_challenge_type? || tri_challenge_type?
    return if !users.empty? && users.length <= 2
    errors.add(:users, 'no more than two users are allowed in an open spot challenge')
  end

  def valid_tri_challenge
    return if normal_challenge_type? || open_spot_challenge_type?
    return if users.length == 3
    errors.add(:users, 'only three users are allowed in a tri challenge')
  end

  def all_users_have_same_instrument_and_part
    return if users.nil? || !users.length.positive?
    instrument = users[0].instrument
    part = users[0].part
    users_filter = users.select { |user| user.instrument == instrument && user.part == part }
    return if users_filter.length == users.length
    errors.add(:users, 'must all have the same instrument and part')
  end

  def no_users_are_admin
    return if users.all? { |user| user.member? || user.squad_leader? }
    errors.add(:users, 'must all be non admin or director')
  end

  # rubocop:disable Metrics/PerceivedComplexity
  def unique_users_in_challenge
    return if users.nil? || !users.length.positive?
    user_one = users[0]
    return if user_one.buck_id != users[1]&.buck_id && (normal_challenge_type? || open_spot_challenge_type?)
    return if user_one.buck_id != users[1]&.buck_id && user_one.buck_id != users[2]&.buck_id && tri_challenge_type?
    errors.add(:users, 'must be unique in a challenge')
  end
  # rubocop:enable Metrics/PerceivedComplexity

  def no_duplicate_challenged_spots
    challenges = Challenge.where(performance: performance)
    return unless challenges.select { |challenge| challenge.spot.id == spot&.id }.length > 1
    errors.add(:challenge, 'must have unique spots for performance')
  end

  def correct_row_for_challenge_type
    if tri_challenge_type?
      return if Challenge.tri_challenge_rows.include? spot.row.to_sym
      rows = Challenge.tri_challenge_rows.map(&:to_s).join(',')
      errors.add(:challenge, "tri challenges can only involve the following rows: [#{rows}]")
    else
      return unless Challenge.tri_challenge_rows.include? spot.row
      errors.add(:challenge, "only tri challenges can involve the row: #{spot.row}")
    end
  end
end
