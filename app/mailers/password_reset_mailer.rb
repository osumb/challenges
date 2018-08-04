class PasswordResetMailer < ApplicationMailer
  def password_reset_email(user_buck_id:, password_reset_request_id:)
    _generate_mail(user_buck_id, password_reset_request_id, "OSUMB Challenges Password Reset")
  end

  def user_creation_email(user_buck_id:, password_reset_request_id:)
    _generate_mail(user_buck_id, password_reset_request_id, "OSUMB Challenge App")
  end

  private

  def _generate_mail(user_buck_id, password_reset_request_id, subject)
    @user = User.find(user_buck_id)
    email = _real_email_strategy? ? @user.email : ENV["MAINTAINER_EMAIL"]
    @reset_link = _url_for_env("password_reset_requests/#{password_reset_request_id}")
    mail(to: email, subject: subject)
  end
end
