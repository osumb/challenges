class PasswordResetMailer < ApplicationMailer
  def password_reset_email(user, prr_id)
    @user = user
    @reset_link = url_for_env prr_id
    mail(to: user.email, subject: 'OSUMB Challenges Password Reset')
  end

  private

  def url_for_env(prr_id)
    route = "/password_reset_requests/#{prr_id}"
    return "#{ENV['PROD_URL']}#{route}" if Rails.env.production?
    return "#{ENV['STAGING_URL']}#{route}" if Rails.env.staging?
    "localhost:#{ENV['CLIENT_PORT']}#{route}"
  end
end
