class ChallengeService
  def self.check_challenges_are_done(performance_id:)
    performance = Performance.includes(:challenges).find(performance_id)

    return unless performance.challenges.all?(&:done_stage?)
    SpotSwitchService.queue_switches(performance_id: performance_id)
  end
end
