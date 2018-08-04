class ChallengeNotificationService
  ChallengeNotDoneError = Class.new(StandardError)

  class << self
    def notify_challengers_of_completion(challenge_id:)
      challenge = Challenge.find(challenge_id)

      raise ChallengeNotDoneError unless challenge.done_stage?

      challenge.users.each { |user| _email_user(challenge.performance_id, user) }
    end

    def _email_user(performance_id, user)
      EmailJob.perform_later(
        klass: "ChallengeResultMailer",
        method: "completed_email",
        args: {
          performance_id: performance_id,
          email: user.email
        }
      )
    end
  end
end
