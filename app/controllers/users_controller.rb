class UsersController < ApplicationController
  before_action :authenticate_user, except: [:reset_password]
  before_action :ensure_admin!, except: [:profile, :reset_password, :update, :upload]
  before_action :ensure_correct_user!, only: [:profile, :update]
  before_action :ensure_password_reset_request_is_valid!, only: [:reset_password]
  before_action :ensure_new_part_exists!, only: [:update]
  before_action :ensure_target_spot_exists!, only: [:switch_spot]

  def index
    @users = User.performers.includes(:current_spot, :original_spot).sort_by(&:current_spot)
  end

  def show
    @user = User.includes(:current_spot, :challenges, :discipline_actions).find(params[:id])
    @performance = Performance.next
  end

  def update
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
    @user = User.includes(:current_spot, :challenges, :discipline_actions).find_by(buck_id: current_user.buck_id)
    @next_performance = Performance.next
  end

  # rubocop:disable Metrics/LineLength
  def search
    q = params[:query].downcase
    names = q.split ' '
    @users = User.performers.where('lower(first_name) LIKE ? OR lower(last_name) LIKE ?', "%#{names.first}%", "%#{names.last}%")
  end
  # rubocop:enable Metrics/LineLength

  def can_challenge
    p = Performance.next
    @users = User.includes(:challenges, :discipline_actions, :current_spot)
                 .performers.select { |u| u.can_challenge_for_performance? p }
  end

  # rubocop:disable Metrics/MethodLength
  def switch_spot
    user = User.find params[:user_buck_id]&.downcase
    target_spot = Spot.where(row: params[:target_spot][:row].downcase, file: params[:target_spot][:file]).first
    old_user_spot = user.current_spot
    target_user = target_spot.current_user
    user.current_spot = target_spot
    target_user.current_spot = old_user_spot

    User.transaction do
      if user.save(validate: false) && target_user.save(validate: false)
        head 204
      else
        render json: { resource: 'user', errors: [user.errors, target_user.errors] }, status: 409
      end
    end
  end

  def reset_password
    prr = PasswordResetRequest.includes(:user).find_by id: params[:password_reset_request_id]
    user = prr.user
    password_digest = BCrypt::Password.create params[:password]
    user.password_digest = password_digest
    user.revoke_token_date = Time.now.utc
    prr.used = true
    if user.save && prr.save
      head 204
    else
      render json: { resource: 'user', errors: user.errors }, status: 409
    end
  end
  # rubocop:enable Metrics/MethodLength

  def upload
    file = Files::Uploader.temporarily_save_file(params[:file])
    loader = User::Loader.new(file: file)
    loader.create_users
    Files::Uploader.remove_temporary_file(file)

    if !loader.errors.any?
      loader.email_users
      head :no_content
    else
      render json: { errors: loader.errors.messages }, status: :unprocessible_entity
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
    invalid_user_id = prr.user.id != User.find(params[:buck_id]&.downcase)&.id
    return unless invalid_prr || invalid_password || invalid_user_id
    head 403
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def ensure_new_part_exists!
    return if params['part'].nil?
    return unless User.parts[params['part']].nil?
    head 409
  end

  # rubocop:disable Metrics/LineLength
  def ensure_target_spot_exists!
    head 409 if params[:target_spot].nil?
    return unless Spot.where(row: params[:target_spot][:row].downcase&.downcase, file: params[:target_spot][:file]).empty?
    head 409
  end
  # rubocop:enable Metrics/LineLength
end
