class SwitchSpotForChallengeJob < ApplicationJob
  queue_as :default

  def perform(challenge_id:)
    SpotSwitchService.switch_spots_for_challenge(challenge_id: challenge_id)
  end
end
