# rubocop:disable Rails/Blank, Style/InverseMethods, Metrics/ClassLength
require 'rubyXL'
require 'securerandom'

class User
  class Loader
    include ActiveModel::Validations

    attr_reader :users, :worksheet

    FULL_NAME = 0
    INSTRUMENT = 1
    SPOT = 2
    PART = 3
    BUCK_ID = 4
    EMAIL = 5
    ROLE = 6

    DEFAULT_PARTS = {
      'any' => 'any',
      'trumpet' => 'first',
      'mellophone' => 'first',
      'trombone' => 'first',
      'baritone' => 'first',
      'percussion' => 'snare',
      'sousaphone' => 'first'
    }.freeze

    def initialize(file:)
      @users = []
      @worksheet = RubyXL::Parser.parse(file)[0]
    end

    def create_users
      reset_database
      worksheet.each_with_index do |row, index|
        break if row[BUCK_ID]&.value.nil?
        next if index.zero?
        spot = create_spot_from_row(row)
        create_user_from_row(row, spot)
      end

      !errors.any?
    end

    def email_users
      return false if errors.any?
      users.each { |user| send_user_creation_email(user) }
      true
    end

    private

    def send_user_creation_email(user)
      PasswordResetRequestService.send_for_new_user(user: user)
    end

    def reset_database
      Challenge.destroy_all
      UserChallenge.destroy_all
      PasswordResetRequest.destroy_all
      DisciplineAction.destroy_all
      Performance.destroy_all
      User.where.not(role: :admin).destroy_all
      Spot.destroy_all
    end

    def create_spot_from_row(row)
      spot_value = row[SPOT]&.value
      return nil unless spot_value.present?
      normalized_spot_value = spot_value.gsub(/\s+/, '')
      Spot.create!(row: normalized_spot_value[0].downcase, file: normalized_spot_value[1..2].to_i)
    end

    def create_user_from_row(row, spot)
      password = SecureRandom.base64(15)
      digest = BCrypt::Password.create(password)
      user_attrs = user_attrs_from_row(row).merge!(password_digest: digest, current_spot: spot, original_spot: spot)
      user = User.new(user_attrs)
      return if user.admin? && User.exists?(buck_id: user.buck_id)
      user.save
      user.errors.full_messages.map(&:downcase).each { |e| errors.add(user.buck_id, e) }
      users << user
    end

    def user_attrs_from_row(row)
      buck_id = row[BUCK_ID]&.value&.downcase
      {
        first_name: get_first_name_for_user(buck_id, row),
        last_name: get_last_name_for_user(buck_id, row),
        instrument: get_instrument_for_user(buck_id, row),
        part: get_part_for_user(buck_id, row),
        buck_id: buck_id,
        role: get_role_for_user(buck_id, row),
        email: get_email_for_user(buck_id, row)
      }
    end

    def get_first_name_for_user(buck_id, row)
      first_name = row[FULL_NAME]&.value&.split(' ')&.[](0)
      errors.add(buck_id, 'must have a first name') unless first_name.present?
      first_name
    end

    def get_last_name_for_user(buck_id, row)
      last_name = row[FULL_NAME]&.value&.split(' ')&.[](1)
      errors.add(buck_id, 'must have a last name') unless last_name.present?
      last_name
    end

    def get_instrument_for_user(buck_id, row)
      instrument = User.instruments[row[INSTRUMENT]&.value&.downcase]
      errors.add(buck_id, 'must have an instrument') unless instrument.present?
      instrument
    end

    def get_part_for_user(buck_id, row)
      part = User.parts[part_value_to_database_value(row[PART]&.value)]
      part = DEFAULT_PARTS[row[INSTRUMENT]&.value&.downcase] unless part.present?
      errors.add(buck_id, 'must have a part') unless part.present?
      part
    end

    def get_role_for_user(_buck_id, row)
      role = User.roles[role_value_to_database_value(row[ROLE]&.value)]
      role || 'member'
    end

    def get_email_for_user(buck_id, row)
      email = row[EMAIL]&.value
      email || "#{buck_id}@osu.edu"
    end

    def part_value_to_database_value(part)
      if part&.to_i&.to_s == part&.to_s
        convert_part_number_to_string(part)
      else
        part&.downcase&.split(' ')&.[](0)
      end
    end

    def convert_part_number_to_string(part)
      case part&.to_i
      when 1
        'first'
      when 2
        'second'
      end
    end

    def role_value_to_database_value(role)
      role&.downcase&.gsub(' ', '_')
    end
  end
end
# rubocop:enable Rails/Blank, Style/InverseMethods, Metrics/ClassLength
