class Challenge < ApplicationRecord
  # enums
  enum challenge_type: [:open_spot, :normal, :tri], _suffix: true
  enum stage: [:needs_comments, :needs_approval, :done], _suffix: true

  # associations
  has_many :user_challenges
  has_many :users, through: :user_challenges
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
  validate :valid_needs_approval_state

  # scopes
  scope :with_users_and_spots, -> { includes(user_challenges: { user: :spot }) }
  scope :done, -> { where(stage: :done) }
  scope :needs_comments, -> { where(stage: :needs_comments) }
  scope :viewable_by_user, lambda { |user|
    if user.admin? || (user.director? && user.instrument_any?)
      with_users_and_spots
    elsif user.director?
      with_users_and_spots.where(users: { instrument: user.instrument })
    elsif user.squad_leader?
      ids = with_users_and_spots.where(spots: { row: user.spot.row }).pluck(:id)
      with_users_and_spots.where(id: ids)
    else
      none
    end
  }
  scope :evaluable, ->(user) { viewable_by_user(user).needs_comments }
  scope :completed, ->(user) { viewable_by_user(user).done }

  # rubocop:disable Metrics/CyclomaticComplexity
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
  # rubpcop:enable Metrics/CyclomaticComplexity

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

  def valid_needs_approval_state
    return unless stage_changed? to: 'needs_approval'

    places = user_challenges.pluck(:place).compact.uniq
    should_not_have_third = !tri_challenge_type? && places.include?('third')

    errors.add(:challenge, 'must be full') unless enough_users?
    errors.add(:challenge, 'must have place assignments') if places.count.zero?
    errors.add(:challenge, 'cannot have duplicate place assignments') if places.count < user_challenges.count
    errors.add(:challenge, 'cannot have a third place unless the challenge is a tri challenge') if should_not_have_third
  end
end
