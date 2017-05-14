class UsersController < ApplicationController
  before_action :authenticate_user, except: [:reset_password]
  before_action :ensure_admin!, except: [:profile, :reset_password, :update]
  before_action :ensure_correct_user!, only: [:profile, :update]
  before_action :ensure_password_reset_request_is_valid!, only: [:reset_password]
  before_action :ensure_new_part_exists!, only: [:update]
  before_action :ensure_target_spot_exists!, only: [:switch_spot]

  def index
    @users = User.performers.includes(:spot)
  end

  def show
    @user = User.includes(:spot, :challenges, :discipline_actions).find(params[:buck_id])
  end

  def update
    logger.info 'HEY'
    @user = User.find params[:id]
    part = User.parts[params[:part]]
    @user.part = part

    if @user.update_attributes update_params
      render :show, status: 200
    else
      render json: { resource: 'user', errors: user.errors }, status: 409
    end
  end

  def profile
    @user = User.includes(:spot, :challenges, :discipline_actions).find_by(buck_id: current_user.buck_id)
    @next_performance = Performance.next
  end

  # rubocop:disable Metrics/MethodLength
  def switch_spot
    user = User.find params[:user_buck_id]
    target_spot = Spot.where(row: params[:target_spot][:row], file: params[:target_spot][:file]).first
    old_user_spot = user.spot
    target_user = target_spot.user
    user.spot = target_spot
    target_user.spot = old_user_spot

    User.transaction do
      if user.save(validate: false) && target_user.save(validate: false)
        head 200
      else
        render json: { resource: 'user', errors: [user.errors, target_user.errors] }, status: 409
      end
    end
  end
  # rubocop:enable Metrics/MethodLength

  def reset_password
    prr = PasswordResetRequest.includes(:user).find_by id: params[:password_reset_request_id]
    user = prr.user
    password_digest = BCrypt::Password.create params[:password]
    user.password_digest = password_digest
    prr.used = true
    if user.save && prr.save
      head 204
    else
      render json: { resource: 'user', errors: user.errors }, status: 409
    end
  end

  private

  def update_params
    params.permit(
      :first_name,
      :last_name,
      :part
    )
  end

  def ensure_admin!
    return if current_user.admin? || current_user.director?
    head 403
  end

  def ensure_correct_user!
    return if current_user.admin? || current_user.director?
    return if params[:buck_id]&.downcase == current_user&.buck_id&.downcase
    return if params[:id]&.downcase == current_user&.buck_id&.downcase
    head 401
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def ensure_password_reset_request_is_valid!
    prr = PasswordResetRequest.includes(:user).find(params[:password_reset_request_id])
    invalid_prr = prr.nil? || prr.used? || prr.expired?
    invalid_password = params[:password].nil? || params[:password].length <= 0
    invalid_user_id = prr.user.id != User.find(params[:buck_id])&.id
    return unless invalid_prr || invalid_password || invalid_user_id
    head 403
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def ensure_new_part_exists!
    return if params['part'].nil?
    return unless User.parts[params['part']].nil?
    head 409
  end

  def ensure_target_spot_exists!
    head 409 if params[:target_spot].nil?
    return unless Spot.where(row: params[:target_spot][:row], file: params[:target_spot][:file]).empty?
    head 409
  end
end
