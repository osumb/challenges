class ChallengeService
  ChallengeAlreadyDoneError = Class.new(StandardError)

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

    def move_to_next_stage(challenge_id:)
      challenge = Challenge.find(challenge_id)
      raise ChallengeAlreadyDoneError if challenge.done_stage?
      challenge.update!(stage: :done)
    end

    def update(challenge_id:, user_challenge_param_hashes:)
      challenge = Challenge.find(challenge_id)
      has_required_places = _param_hash_required_user_challenge_places?(challenge, user_challenge_param_hashes)
      user_challenge_update_params = _map_user_challenge_update_params(user_challenge_param_hashes, has_required_places)
      result = UserChallengeService.update(user_challenge_hashes: user_challenge_update_params)
      OpenStruct.new(
        success?: result.success?,
        errors: _error_message_for_update(result, challenge, user_challenge_param_hashes)
      )
    end

    private

    def _map_user_challenge_update_params(user_challenge_param_hashes, has_required_places)
      user_challenge_param_hashes.map do |hash|
        if has_required_places
          hash["place"] = hash["place"].to_i
          hash
        else
          hash.except("place")
        end
      end
    end

    def _param_hash_required_user_challenge_places?(challenge, user_challenge_param_hashes)
      _missing_places(challenge, user_challenge_param_hashes).empty?
    end

    def _error_message_for_update(user_challenge_update_result, challenge, user_challenge_param_hashes)
      return user_challenge_update_result.errors if user_challenge_update_result.errors
      return nil if _param_hash_required_user_challenge_places?(challenge, user_challenge_param_hashes)
      I18n.t!(
        "client_messages.challenges.evaluate.invalid_user_challenge_places",
        places: _required_places(challenge),
        missing: _missing_places(challenge, user_challenge_param_hashes)
      )
    end

    def _required_places(challenge)
      challenge.required_user_challenge_places.sort
    end

    def _submitted_places(user_challenge_param_hashes)
      user_challenge_param_hashes.map { |param| param["place"] }.uniq.sort.map(&:to_i)
    end

    def _missing_places(challenge, user_challenge_param_hashes)
      _required_places(challenge) - _submitted_places(user_challenge_param_hashes)
    end

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
