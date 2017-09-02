# Preview all emails at http://localhost:3001/rails/mailers/challenge_success_mailer
class ChallengeListPreview < ActionMailer::Preview
  def challenge_list_email
    builder = Challenge::ListBuilder.new(Performance.first)
    builder.build_challenge_list
    loc = builder.write_list_to_disk
    ChallengeListMailer.challenge_list_email(loc)
  end
end
