class SpotSwitchMailer < ApplicationMailer
  def spot_switch_email(err = nil)
    return unless Rails.env.test?
    email = ENV['MAINTAINER_EMAIL']
    @err = err
    mail(to: email, subject: 'Spot Switch Error')
  end
end
