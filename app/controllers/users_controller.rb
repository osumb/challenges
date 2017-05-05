class UsersController < ApplicationController
  before_action :authenticate_user, except: [:reset_password]
  before_action :ensure_admin!, except: [:profile, :reset_password]
  before_action :ensure_correct_user!, only: [:profile]
  before_action :ensure_password_reset_request_is_valid!, only: [:reset_password]

  def index
    @users = User.performers.includes(:spot)
  end

  def show
    @user = User.includes(:spot, :challenges, :discipline_actions).find_by(buck_id: params[:id])
    return unless @user.nil?
    head 404
  end

  def profile
    @user = User.includes(:spot, :challenges, :discipline_actions).find_by(buck_id: current_user.buck_id)
    @next_performance = Performance.next
  end

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

  def ensure_admin!
    return if current_user.admin? || current_user.director?
    head 401
  end

  def ensure_correct_user!
    return if current_user.admin? || current_user.director?
    return if params[:id]&.downcase == current_user&.buck_id&.downcase
    head 401
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def ensure_password_reset_request_is_valid!
    prr = PasswordResetRequest.includes(:user).find_by(id: params[:password_reset_request_id])
    invalid_prr = prr.nil? || prr.used? || prr.expired?
    invalid_password = params[:password].nil? || params[:password].length <= 0
    invalid_user_id = prr.user.id != User.find_by(id: params[:id])&.id
    return unless invalid_prr || invalid_password || invalid_user_id
    head 403
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
