class ChallengeService
  class << self
    def check_other_challenges_are_done(challenge_id:) # rubocop:disable Metrics/MethodLength
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

    def remove_user_from_challenge(challenge_id:, user_buck_id:)
      user_challenge = UserChallenge.find_by(challenge_id: challenge_id, user_buck_id: user_buck_id)
      challenge = Challenge.find(challenge_id)
      if challenge.open_spot_challenge_type?
        _remove_user_from_open_spot_challenge(user_challenge, challenge)
      else
        challenge.destroy
      end
      OpenStruct.new(success?: true)
    end

    private

    def _remove_user_from_open_spot_challenge(user_challenge, challenge)
      UserChallenge.transaction do
        if challenge.full?
          user_challenge.destroy
        else
          challenge.destroy
        end
      end
    end
  end
end
