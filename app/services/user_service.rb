module UserService
  class << self
    def deactivate_user(buck_id:)
      user = User.find(buck_id)
      user.update(active: false, current_spot: nil, original_spot: nil)
      user.save!
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

        errors = [first_user.errors.full_messages, second_user.errors.full_messages].flatten.join(",")
        return Result.failure(errors: errors)
      end
    end

    def user_only_has_spot_errors(user:)
      return true if user.valid?
      error_messages = user.errors.messages
      return false if error_messages.keys.length > 2
      error_messages.key?(:current_spot_id) && error_messages.key?(:original_spot_id)
    end
  end
end
