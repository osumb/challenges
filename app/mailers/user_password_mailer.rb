class UserPasswordMailer < ApplicationMailer
  attr_reader :password, :user

  def user_password_email(user:, password:)
    return if Rails.env.test?
    @user = user
    @password = password
    mail(to: user.email, subject: 'OSUMB Challenge App').deliver
  end
end
