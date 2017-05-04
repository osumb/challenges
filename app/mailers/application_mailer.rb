# frozen_string_literal: true
class ApplicationMailer < ActionMailer::Base
  default from: 'osumbit@gmail.com'
  layout 'mailer'
end
