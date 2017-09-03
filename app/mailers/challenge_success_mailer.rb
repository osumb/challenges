class ChallengeSuccessMailer < ApplicationMailer
  attr_reader :initiated_by, :challenge

  def challenge_success_email(initiated_by:, challenge:, email:)
    return if Rails.env.test?
    @initiated_by = initiated_by
    @challenge = challenge
    to = Rails.env.production? ? email : ENV['MAINTAINER_EMAIL']
    mail(to: to, subject: 'OSUMB Challenge Creation Success')
  end
end
