class SwitchSpotForChallengeJob < ApplicationJob
  queue_as :switch_spot_for_challenge

  def perform(challenge_id:)
    SpotSwitchService.switch_spots_for_challenge(challenge_id: challenge_id)
  end
end
