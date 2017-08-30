# Preview all emails at http://localhost:3001/rails/mailers/spot_switch_mailer
class SpotSwitchMailerPreview < ActionMailer::Preview
  def spot_switch_email
    SpotSwitchMailer.spot_switch_email user: 'Can\'t be bad'
  end
end
