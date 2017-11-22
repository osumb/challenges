class ChallengeService
  # rubocop:disable Metrics/MethodLength
  def self.check_other_challenges_are_done(challenge_id:)
    challenge = Challenge.includes(:users).find(challenge_id)
    user = challenge.users.first
    challenges = Challenge.find_by_sql(<<~SQL)
      SELECT distinct c.*
      FROM challenges c
      INNER JOIN user_challenges uc ON uc.challenge_id = c.id
      INNER JOIN users u ON u.buck_id = uc.user_buck_id
      WHERE c.performance_id = #{challenge.performance_id}
        AND u.instrument = #{User.instruments[user.instrument]}
        AND u.part = #{User.parts[user.part]}
    SQL

    return unless challenges.all?(&:done_stage?)

    challenges.each do |c|
      SwitchSpotForChallengeJob.perform_later(challenge_id: c.id)
    end
  end
end
