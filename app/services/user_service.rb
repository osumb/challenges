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
