class PerformanceService
  def self.email_challenge_list(performance_id:)
    builder = Challenge::ListBuilder.new(performance_id)

    builder.build_challenge_list
    stream = builder.write_list_to_buffer

    ChallengeListMailer.challenge_list_email(stream).deliver_now
  end
end
