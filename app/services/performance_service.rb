class PerformanceService
  def self.email_challenge_list(performance_id:)
    builder = Challenge::ListBuilder.new(performance_id)

    builder.build_challenge_list
    stream = builder.write_list_to_buffer

    ChallengeListMailer.challenge_list_email(stream).deliver_now
  end

  def self.queue_new_performance_emails(performance_id:)
    User.alternates.each do |user|
      EmailJob.perform_later(
        klass: 'NewPerformanceMailer',
        method: 'new_performance_email',
        args: {
          performance_id: performance_id,
          email: user.email
        }
      )
    end
  end
end
