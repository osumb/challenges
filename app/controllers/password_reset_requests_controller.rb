class PasswordResetRequestsController < ApplicationController
  before_action :ensure_user_exist!, only: [:create]
  before_action :ensure_email_matches!, only: [:create]
  before_action :ensure_request_is_not_used!, only: %i[show reset]
  before_action :ensure_request_is_not_expired!, only: %i[show reset]
  before_action :ensure_passwords_match!, only: [:reset]

  def new; end

  def create # rubocop:disable Metrics/MethodLength
    user = User.find(params[:buck_id])
    request = PasswordResetRequest.new(user: user)
    if request.save
      EmailJob.perform_later(
        klass: PasswordResetMailer.to_s,
        method: 'password_reset_email',
        args: {
          user_buck_id: user.buck_id,
          password_reset_request_id: request.id
        }
      )
      send_back(message: I18n.t!('client_messages.password_reset_requests.create.success', email: user.email))
    else
      send_back(errors: request.errors.full_messages.join(','))
    end
  end

  def show
    @password_reset_request = PasswordResetRequest.find(params[:id])
  end

  def reset
    encrypted_password = PasswordService.encrypt_password(password: params[:password])
    errors = PasswordService.reset_password(password_reset_request_id: params[:id], password_digest: encrypted_password)

    flash_hash = if errors.none?
                   { message: I18n.t!('client_messages.password_reset_requests.reset.success') }
                 else
                   { errors: errors.full_messages.join(', ') }
                 end
    send_back(flash_hash)
  end

  private

  def ensure_user_exist!
    buck_id = params[:buck_id]
    return if User.find_by(buck_id: buck_id.downcase).present?
    send_back(errors: I18n.t!('client_messages.password_reset_requests.create.not_found', buck_id: buck_id))
  end

  def ensure_email_matches!
    buck_id = params[:buck_id]
    email = params[:email]
    user = User.find(buck_id)
    return if email.casecmp(user.email).zero?
    send_back(errors: I18n.t!('client_messages.password_reset_requests.create.not_found', buck_id: buck_id))
  end

  def ensure_passwords_match!
    return if params[:password] == params[:password_confirmation]
    send_back(errors: I18n.t!('client_messages.password_reset_requests.reset.passwords_do_not_match'))
  end

  def ensure_request_is_not_used!
    req = PasswordResetRequest.find(params[:id])
    return unless req.used?
    flash.now[:errors] = I18n.t!('client_messages.password_reset_requests.show.used')
  end

  def ensure_request_is_not_expired!
    req = PasswordResetRequest.find(params[:id])
    return unless req.expired?
    flash.now[:errors] = I18n.t!('client_messages.password_reset_requests.show.expired')
  end
end
