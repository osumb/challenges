# Preview all emails at http://localhost:3000/rails/mailers/password_reset_mailer
class PasswordResetMailerPreview < ActionMailer::Preview
  def password_reset_email
    PasswordResetMailer.password_reset_email User.first, 5
  end

  def user_creation_email
    PasswordResetMailer.user_creation_email User.first, 5
  end
end
