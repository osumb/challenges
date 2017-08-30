# Preview all emails at http://localhost:3001/rails/mailers/challenge_success_mailer
class ChallengeSuccessMailerPreview < ActionMailer::Preview
  def challenge_success_email_by_self
    ChallengeSuccessMailer.challenge_success_email(
      initiated_by: User.first,
      challenge: Challenge.first,
      email: User.first.email
    )
  end

  def challenge_success_email_by_admin
    ChallengeSuccessMailer.challenge_success_email(
      initiated_by: User.find_by(role: :admin),
      challenge: Challenge.first,
      email: User.first.email
    )
  end
end
