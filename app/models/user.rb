class User < ApplicationRecord
  scope :performers, -> { where(role: :member).or(where(role: :squad_leader)) }

  # enums
  enum instrument: [:any, :trumpet, :mellophone, :trombone, :baritone, :percussion, :sousaphone], _prefix: true
  enum part: [:any, :efer, :solo, :first, :second, :flugel, :bass, :snare, :cymbals, :tenor], _suffix: true
  enum role: [:admin, :director, :member, :squad_leader]

  # associations
  belongs_to :spot, optional: true

  # validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true, format: {
    with: /\A[^@\s]+@[^@\s]+\z/,
    message: 'must be an email address'
  }

  validates :password_digest, presence: true
  validates :buck_id, presence: true, uniqueness: true, format: {
    with: /\A[a-z]+\.[1-9][0-9]*\z/,
    message: 'must be a valid name.number'
  }
  validates :instrument, presence: true
  validates :part, presence: true
  validates :role, presence: true
  validates :spot_id, uniqueness: { allow_blank: true }

  validate :performing_member_has_spot
  validate :admin_does_not_have_spot
  validate :valid_instrument_part_for_user
  validate :valid_instrument_part_for_admin

  before_validation :downcase_buck_id
  before_save :downcase_email

  has_secure_password

  private

  def performing_member_has_spot
    return if admin? || director?
    return unless spot.nil?
    errors.add(:spot, 'can\'t be blank')
  end

  def admin_does_not_have_spot
    return if !admin? && !director?
    return if spot.nil?
    errors.add(:role, 'admin or director can\'t have a spot')
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/AbcSize
  def valid_instrument_part_for_user
    return if admin? || director?
    return if instrument.nil? || part.nil?
    return if spot.nil?
    return if Spot.valid_instrument_part_for_row(Spot.rows[spot.row], User.instruments[instrument], User.parts[part])
    errors.add(:spot, "row #{spot.row}, can't be a #{part} #{instrument}")
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/AbcSize

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/AbcSize
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
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/AbcSize

  def downcase_buck_id
    buck_id.try(:downcase!)
  end

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
