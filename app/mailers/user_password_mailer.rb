class UserPasswordMailer < ApplicationMailer
  attr_reader :password, :user

  def user_password_email(user:, password:)
    return if Rails.env.test?
    @user = user
    @password = password
    to = Rails.env.production? ? user.email : ENV['MAINTAINER_EMAIL']
    mail(to: to, subject: 'OSUMB Challenge App')
  end
end
