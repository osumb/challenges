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

  # rubocop:disable Metrics/CyclomaticComplexity
  def full?
    return true if normal_challenge_type? && users.length == 2
    return true if open_spot_challenge_type? && users.length == 2
    return true if tri_challenge_type? && users.length == 3
    false
  end
  # rubpcop:enable Metrics/CyclomaticComplexity

  # rows that are allowed to have a tri challenge associated with it
  def self.tri_challenge_rows
    [:j]
  end

  # rubocop:disable Metrics/PerceivedComplexity
  def can_be_evaluated_by?(user:)
    return false if user.member?
    return true if user.admin?
    return true if user.director? && (user.instrument_any? || user.instrument == users.first.instrument)
    return true if user.squad_leader? && users.any? { |u| u.spot.row == user.spot.row }
    false
  end
  # rubocop:enable Metrics/PerceivedComplexity

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
