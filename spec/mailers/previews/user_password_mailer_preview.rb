# Preview all emails at http://localhost:3001/rails/mailers/user_password_mailer
class UserPasswordMailerPreview < ActionMailer::Preview
  def user_password_email
    UserPasswordMailer.user_password_email(
      user: User.first,
      password: 'SomePasswordString'
    )
  end
end
