class PerformanceService
  def self.create(name:, date:, window_open:, window_close:, client_timezone:)
    Time.use_zone(client_timezone) do
      Performance.create(name: name, date: date, window_close: window_close, window_open: window_open)
    end
  rescue ArgumentError
    OpenStruct.new(
      valid?: false,
      errors: OpenStruct.new(full_messages: ["Invalid client timezone: #{client_timezone}"])
    )
  end

  def self.update(id:, name:, date:, window_open:, window_close:, client_timezone:) # rubocop:disable Metrics/ParameterLists, Metrics/LineLength
    Time.use_zone(client_timezone) do
      p = Performance.find(id)
      p.update(name: name, date: date, window_close: window_close, window_open: window_open)
      p
    end
  rescue ArgumentError
    OpenStruct.new(
      valid?: false,
      errors: OpenStruct.new(full_messages: ["Invalid client timezone: #{client_timezone}"])
    )
  end

  def self.email_challenge_list(performance_id:)
    builder = Challenge::ListBuilder.new(performance_id)

    builder.build_challenge_list
    stream = builder.write_list_to_buffer

    ChallengeListMailer.challenge_list_email(stream).deliver_now
  end

  def self.queue_new_performance_emails(performance_id:)
    User.alternates.each do |user|
      EmailJob.perform_later(
        klass: "NewPerformanceMailer",
        method: "new_performance_email",
        args: {
          performance_id: performance_id,
          email: user.email
        }
      )
    end
  end
end
