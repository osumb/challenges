class CheckOtherChallengesDoneJob < ApplicationJob
  queue_as :check_other_challenges_done

  def perform(challenge_id:)
    ChallengeService.check_other_challenges_are_done(challenge_id: challenge_id)
  end
end
