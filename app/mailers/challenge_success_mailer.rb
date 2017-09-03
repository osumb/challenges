class ChallengeSuccessMailer < ApplicationMailer
  attr_reader :initiated_by, :challenge

  def challenge_success_email(initiated_by:, challenge:, email:)
    return if Rails.env.test?
    @initiated_by = initiated_by
    @challenge = challenge
    mail(to: email, subject: 'OSUMB Challenge Creation Success').deliver
  end
end
