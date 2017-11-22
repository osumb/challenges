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
