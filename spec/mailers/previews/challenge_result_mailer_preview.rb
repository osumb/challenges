# Preview all emails at http://localhost:3000/rails/mailers/challenge_result_mailer

class ChallengeResultMailerPreview < ActionMailer::Preview
  def completed_email
    ChallengeResultMailer.completed_email(
      performance_id: Performance.first.id,
      email: User.first.email
    )
  end
end
