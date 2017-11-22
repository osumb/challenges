module UserService
  def self.create(params:)
    new_user = _user_from_params(params)

    if new_user.performer?
      User.transaction do
        old_user = User.find_by(current_spot: new_user.current_spot)
        deactivate_user(buck_id: old_user.buck_id) unless old_user.nil?
      end
    end

    new_user.save! if new_user.valid?
    new_user
  end

  def self.deactivate_user(buck_id:)
    user = User.find(buck_id)
    user.active = false
    user.current_spot = nil
    user.original_spot = nil
    user.save!
    user
  end

  # rubocop:disable Metrics/MethodLength
  def self._user_from_params(params)
    permitted = _create_params(params)
    spot = nil

    unless permitted[:spot].nil?
      spot_params = permitted[:spot]
      spot = Spot.find_by(row: spot_params[:row]&.downcase&.to_sym, file: spot_params[:file]&.to_i)
    end

    hash = permitted.to_h
    hash.delete(:spot)

    user = User.new(hash)
    user.current_spot = spot
    user.original_spot = spot
    user.password_digest = SecureRandom.base64
    user
  end
  # rubocop:enable Metrics/MethodLength

  def self._create_params(params)
    params.require(:user).permit(
      :first_name,
      :last_name,
      :buck_id,
      :email,
      :role,
      :instrument,
      :part,
      spot: [:row, :file]
    )
  end
end
