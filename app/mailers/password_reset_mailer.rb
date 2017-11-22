class PasswordResetMailer < ApplicationMailer
  def password_reset_email(user_buck_id:, password_reset_request_id:)
    generate_mail(user_buck_id, password_reset_request_id, 'OSUMB Challenges Password Reset')
  end

  def user_creation_email(user_buck_id:, password_reset_request_id:)
    generate_mail(user_buck_id, password_reset_request_id, 'OSUMB Challenge App')
  end

  private

  def generate_mail(user_buck_id, password_reset_request_id, subject)
    return if Rails.env.test?
    @user = User.find(user_buck_id)
    email = !Rails.env.production? ? ENV['MAINTAINER_EMAIL'] : @user.email
    @reset_link = url_for_env(password_reset_request_id)
    mail(to: email, subject: subject)
  end

  def url_for_env(prr_id)
    route = "/password_reset_requests/#{prr_id}"
    return "#{ENV['PROD_URL']}#{route}" if Rails.env.production?
    return "#{ENV['STAGING_URL']}#{route}" if Rails.env.staging? # rubocop:disable Rails/UnknownEnv
    "http://localhost:#{ENV['CLIENT_PORT']}#{route}"
  end
end
