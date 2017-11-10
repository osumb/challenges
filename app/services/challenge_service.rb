class ChallengeService
  def self.check_challenges_are_done(performance_id:)
    performance = Performance.includes(:challenges).find(performance_id)

    return unless performance.challenges.all?(&:done_stage?)

    switcher = Challenge::SpotSwitcher.new(performance)

    switcher.run!
    SpotSwitchMailer.spot_switch_email.deliver_now
  end
end
