module UserCreationService
  InvalidRole = Class.new(StandardError)

  class << self
    def create_user(params:)
      role = params[:role]
      case role
      when User::Roles::ADMIN, User::Roles::DIRECTOR
        _create_non_performer(params)
      when User::Roles::MEMBER, User::Roles::SQUAD_LEADER
        _insert_new_performer(params)
      else
        raise InvalidRole, role
      end
    end

    private

    def _create_non_performer(user)
      user = User.new(_create_params(user))
      return _success(user) if user.save
      _failure(user)
    end

    def _insert_new_performer(user_params) # rubocop:disable Metrics/MethodLength
      spot = SpotService.find(query: user_params[:spot] || '')
      return _failure(nil, "Spot #{user_params[:spot].inspect} doesn't exist") if spot.nil?
      new_user = User.new(_create_params(user_params))
      return _failure(new_user) unless _user_only_has_spot_errors(new_user)

      user_to_deactivate = spot.current_user
      current_spot = user_to_deactivate.current_spot
      original_spot = user_to_deactivate.original_spot

      User.transaction do
        user_to_deactivate = UserService.deactivate_user(buck_id: user_to_deactivate.buck_id)
        new_user.update(current_spot: current_spot, original_spot: original_spot)
        return _success(new_user) if new_user.save
        user_to_deactivate.update!(current_spot: current_spot, original_spot: original_spot, active: true)
        return _failure(new_user)
      end
    end

    def _user_only_has_spot_errors(user)
      user.valid?
      user.errors.each do |error|
        return false if error != :current_spot && error != :original_spot
      end
      true
    end

    def _create_params(user)
      user.except(:spot).merge(password_digest: SecureRandom.base64)
    end

    def _success(user)
      OpenStruct.new(success?: true, user: user, errors: nil)
    end

    def _failure(user, errors = nil)
      error_message = errors || user.errors.full_messages.join(', ')
      OpenStruct.new(success?: false, user: nil, errors: error_message)
    end
  end
end
