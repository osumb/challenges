# Preview all emails at http://localhost:3000/rails/mailers/challenge_success_mailer
class ChallengeListPreview < ActionMailer::Preview
  def challenge_list_email
    builder = Challenge::ListBuilder.new(Performance.first)
    builder.build_challenge_list
    ChallengeListMailer.challenge_list_email("fake steam")
  end
end
