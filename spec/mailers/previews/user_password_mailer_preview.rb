# Preview all emails at http://localhost:3001/rails/mailers/user_password_mailer
class UserPasswordMailerPreview < ActionMailer::Preview
  def user_password_email
    UserPasswordMailer.user_password_email(
      User.first,
      PasswordResetRequest.first || PasswordResetRequest.new(id: 'some_uuid', user: User.first)
    )
  end
end
