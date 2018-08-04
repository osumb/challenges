class NotifyChallengeCompletionJob < ApplicationJob
  queue_as :notify_challenge_completion_job

  def perform(challenge_id:)
    ChallengeNotificationService.notify_challengers_of_completion(challenge_id: challenge_id)
  end
end
