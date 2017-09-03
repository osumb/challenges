class SpotSwitchMailer < ApplicationMailer
  def spot_switch_email(err = nil)
    return if Rails.env.test?
    email = ENV['MAINTAINER_EMAIL']
    @err = err
    subject = @err.nil? ? 'Spot Switch Success' : 'Spot Switch Error'
    mail(to: email, subject: subject).deliver
  end
end
