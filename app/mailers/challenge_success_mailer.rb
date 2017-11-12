class ChallengeSuccessMailer < ApplicationMailer
  attr_reader :initiated_by, :challenge

  def challenge_success_email(initiator_buck_id:, challenge_id:, email:)
    return if Rails.env.test?
    @initiated_by = User.find(initiator_buck_id)
    @challenge = Challenge.find(challenge_id)
    to = Rails.env.production? ? email : ENV['MAINTAINER_EMAIL']
    mail(to: to, subject: 'OSUMB Challenge Creation Success')
  end
end
