class CheckChallengesDoneJob < ApplicationJob
  queue_as :default

  def perform(performance_id:)
    ChallengeService.check_challenges_are_done(performance_id: performance_id)
  end
end
