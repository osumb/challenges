class PasswordResetMailer < ApplicationMailer
  def password_reset_email(user, pcr_id)
    @user = user
    @reset_link = url_for_env pcr_id
    mail(to: user.email, subject: 'OSUMB Challenges Password Reset')
  end

  private

  def url_for_env(pcr_id)
    route = "/password_change_requests/#{pcr_id}"
    return "#{ENV['PROD_URL']}#{route}" if Rails.env.production?
    return "#{ENV['STAGING_URL']}#{route}" if Rails.env.staging?
    "localhost:#{ENV['CLIENT_PORT']}#{route}"
  end
end
