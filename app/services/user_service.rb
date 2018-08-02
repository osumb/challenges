module UserService
  class << self
    def create(params:)
      _user_from_params(params)
    end

    def deactivate_user(buck_id:)
      user = User.find(buck_id)
      user.update(active: false, current_spot: nil, original_spot: nil)
      user.save!
      user
    end

    def swap_in_new_user(user:)
      User.transaction do
        if user.performer?
          old_user = User.find_by(current_spot: user.current_spot)
          deactivate_user(buck_id: old_user.buck_id) unless old_user.nil?
        end
        user.save
      end

      user
    end

    def switch_spots(first_user:, second_user:) # rubocop:disable Metrics/MethodLength
      first_spot = first_user.current_spot
      first_row = Spot.rows[first_spot.row]
      first_instrument = User.instruments[first_user.instrument]
      first_part = User.parts[first_user.part]
      second_spot = second_user.current_spot
      second_row = Spot.rows[second_spot.row]
      second_instrument = User.instruments[second_user.instrument]
      second_part = User.parts[second_user.part]

      unless Spot.valid_instrument_part_for_row(second_row, first_instrument, first_part)
        return Result.failure(errors: "#{first_user.full_name} can't have spot #{second_spot}")
      end

      unless Spot.valid_instrument_part_for_row(first_row, second_instrument, second_part)
        return Result.failure(errors: "#{second_user.full_name} can't have spot #{first_spot}")
      end

      User.transaction do
        first_user.current_spot = second_spot
        second_user.current_spot = first_spot
        return Result.success if first_user.save(validate: false) && second_user.save(validate: false)

        errors = [first_user.errors.full_messages, second_user.errors.full_messages].flatten.join(',')
        return Result.failure(errors: errors)
      end
    end

    def user_only_has_spot_errors(user:)
      return true if user.valid?
      error_messages = user.errors.messages
      return false if error_messages.keys.length > 2
      error_messages.key?(:current_spot_id) && error_messages.key?(:original_spot_id)
    end

    private

    # rubocop:disable Metrics/MethodLength
    def _user_from_params(params)
      user_attributes = _create_params(params).to_h
      user_attributes[:password_digest] = SecureRandom.base64

      if user_attributes[:spot].present?
        row = user_attributes[:spot][:row]&.downcase&.to_sym
        file = user_attributes[:spot][:file]&.to_i
        spot = Spot.find_by(row: row, file: file)
        user_attributes.delete(:spot)
        user_attributes[:current_spot] = spot
        user_attributes[:original_spot] = spot
      end

      user_attributes[:role] = user_attributes[:role]&.downcase&.to_sym
      user_attributes[:instrument] = user_attributes[:instrument]&.downcase&.to_sym
      user_attributes[:part] = user_attributes[:part]&.downcase&.to_sym

      User.new(user_attributes)
    end
    # rubocop:enable Metrics/MethodLength

    def _create_params(params)
      params.require(:user).permit(
        :first_name,
        :last_name,
        :buck_id,
        :email,
        :role,
        :instrument,
        :part,
        spot: %i[row file]
      )
    end
  end
end
