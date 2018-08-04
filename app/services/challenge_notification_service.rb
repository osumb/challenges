class ChallengeNotificationService
  ChallengeNotDoneError = Class.new(StandardError)

  class << self
    def notify_challengers_of_completion(challenge_id:)
      challenge = Challenge.find(challenge_id)

      raise ChallengeNotDoneError unless challenge.done_stage?

      challenge.users.each do |user|
        EmailJob.perform_later(
          klass: 'ChallengeResultMailer',
          method: 'completed_email',
          args: {
            performance_id: challenge.performance_id,
            email: user.email
          }
        )
      end
    end
  end
end
