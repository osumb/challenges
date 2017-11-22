# rubocop:disable Metrics/ClassLength
class User < ApplicationRecord
  self.primary_key = 'buck_id'

  scope :performers, -> { where(role: %i[member squad_leader]) }
  scope :alternates, -> { joins(:current_spot).where('file > 12') }
  scope :active, -> { where(active: true) }

  # enums
  enum instrument: %i[any trumpet mellophone trombone baritone percussion sousaphone], _prefix: true
  enum part: %i[any efer solo first second flugel bass snare cymbals tenor], _suffix: true
  enum role: %i[admin director member squad_leader]

  # associations
  belongs_to :current_spot, class_name: 'Spot', foreign_key: :current_spot_id, optional: true
  belongs_to :original_spot, class_name: 'Spot', foreign_key: :original_spot_id, optional: true
  has_many :user_challenges, foreign_key: 'user_buck_id', dependent: :destroy
  has_many :challenges, through: :user_challenges
  has_many :discipline_actions, foreign_key: 'user_buck_id', dependent: :destroy
  has_many :password_reset_requests, foreign_key: 'user_buck_id', dependent: :destroy

  # validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true, format: {
    with: /\A[^@\s]+@[^@\s]+\z/,
    message: 'must be an email address'
  }

  validates :password_digest, presence: true
  validates :buck_id, presence: true, uniqueness: true, format: {
    with: /\A[a-z\-]+\.[1-9][0-9]*\z/,
    message: 'must be a valid name.number'
  }
  validates :instrument, presence: true
  validates :part, presence: true
  validates :role, presence: true
  validates :current_spot_id, uniqueness: { allow_blank: true }, if: :active
  validates :original_spot_id, uniqueness: { allow_blank: true }, if: :active

  validate :performing_member_has_spot, on: :create
  validate :admin_does_not_have_spot
  validate :valid_instrument_part_for_user
  validate :valid_instrument_part_for_admin

  before_save :downcase_email

  has_secure_password

  def self.from_token_request(request)
    buck_id = request.params[:auth] && request.params[:auth][:buck_id]&.downcase
    find_by buck_id: buck_id
  end

  def self.from_token_payload(payload)
    find_by buck_id: payload['sub']
  end

  # rubocop:disable Metrics/MethodLength
  def to_token_payload
    payload = {}

    payload[:sub] = buck_id
    payload[:buckId] = buck_id
    payload[:firstName] = first_name
    payload[:lastName] = last_name
    payload[:currentSpot] = current_spot && { row: current_spot.row.upcase, file: current_spot.file }
    payload[:instrument] = instrument&.capitalize
    payload[:part] = part&.capitalize
    payload[:role] = role.camelize
    payload[:revokeTokenDate] = revoke_token_date
    payload[:issuedAt] = Time.now.utc.to_i
    payload
  end
  # rubocop:enable Metrics/MethodLength

  def alternate?
    current_spot.file > 12
  end

  def performer?
    squad_leader? || member?
  end

  def can_challenge_for_performance?(performance)
    return false if admin? || director?
    return false if performance.nil? || !performance.window_open?
    if alternate?
      can_alternate_challenge_for_performance? performance
    else
      can_member_challenge_for_performance? performance
    end
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  private

  def can_alternate_challenge_for_performance?(performance)
    return false if challenges.select { |c| c.performance.id == performance.id }.length.positive?
    discipline_actions.select { |d| d.performance&.id == performance.id }.length <= 0
  end

  def can_member_challenge_for_performance?(performance)
    return false if challenges.select { |c| c.performance.id == performance.id }.length.positive?
    return false if discipline_actions.select { |d| d.performance.id == performance.id }.length <= 0
    discipline_actions.select { |d| d.performance.id == performance.id }.first&.allowed_to_challenge
  end

  def performing_member_has_spot
    return if admin? || director?
    return unless current_spot.nil?
    errors.add(:current_spot, 'can\'t be blank')
    errors.add(:original_spot, 'can\'t be blank')
  end

  def admin_does_not_have_spot
    return if !admin? && !director?
    return if current_spot.nil?
    errors.add(:role, 'admin or director can\'t have a spot')
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/LineLength
  def valid_instrument_part_for_user
    return if admin? || director?
    return if instrument.nil? || part.nil?
    return if current_spot.nil?
    return if Spot.valid_instrument_part_for_row(Spot.rows[current_spot.row], User.instruments[instrument], User.parts[part])
    errors.add(:current_spot, "row #{current_spot.row}, can't be a #{part} #{instrument}")
  end
  # rubocop:enable Metrics/LineLength

  # rubocop:disable Metrics/PerceivedComplexity
  def valid_instrument_part_for_admin
    return unless admin? || director?
    return if instrument_any? || any_part?
    return if instrument_trumpet? && valid_trumpet_part(User.parts[part])
    return if instrument_mellophone? && valid_mellophone_part(User.parts[part])
    return if instrument_trombone? && valid_trombone_part(User.parts[part])
    return if instrument_baritone? && valid_baritone_part(User.parts[part])
    return if instrument_percussion? && valid_percussion_part(User.parts[part])
    return if instrument_sousaphone? && valid_sousaphone_part(User.parts[part])
    errors.add(:admin, "with instrument #{instrument} can't have part #{part}")
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

  def downcase_email
    email.try(:downcase!)
  end

  def valid_trumpet_part(part)
    parts = User.parts
    [parts[:efer], parts[:solo], parts[:first], parts[:second], parts[:flugel]].include? part
  end

  def valid_mellophone_part(part)
    parts = User.parts
    [parts[:first], parts[:second]].include? part
  end

  def valid_trombone_part(part)
    parts = User.parts
    [parts[:first], parts[:second], parts[:bass]].include? part
  end

  def valid_baritone_part(part)
    parts = User.parts
    [parts[:first]].include? part
  end

  def valid_percussion_part(part)
    parts = User.parts
    [parts[:snare], parts[:bass], parts[:cymbals], parts[:tenor]].include? part
  end

  def valid_sousaphone_part(part)
    parts = User.parts
    [parts[:first]].include? part
  end
end
