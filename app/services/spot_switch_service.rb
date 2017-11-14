class SpotSwitchService
  ChallengeNotDone = Class.new(StandardError)
  ChallengesNotDone = Class.new(StandardError)

  def self.queue_switches(performance_id:)
    performance = Performance.includes(:challenges).find(performance_id)
    raise ChallengesNotDone, performance.id unless performance.challenges.all(&:done_stage?)

    _sort_challenges(performance.challenges).each do |challenge|
      SwitchSpotForChallengeJob.perform_later(challenge_id: challenge.id)
    end
  end

  # rubocop:disable Metrics/MethodLength
  def self.switch_spots_for_challenge(challenge_id:)
    challenge = Challenge.includes(:user_challenges, :users).find(challenge_id)
    raise ChallengeNotDone, challenge.id unless challenge.done_stage?
    if challenge.normal_challenge_type?
      _switch_for_normal_challenge(challenge)
    elsif challenge.open_spot_challenge_type?
      _switch_for_open_spot_challenge(challenge)
    elsif challenge.tri_challenge_type?
      _switch_for_tri_challenge(challenge)
    else
      raise InvalidChallengeType, challenge.id
    end
  end
  # rubocop:enable Metrics/MethodLength

  def self._switch_for_normal_challenge(challenge)
    user_challenges = challenge.user_challenges
    winner = user_challenges.select(&:first_place?).first.user
    loser = user_challenges.reject(&:first_place?).first.user
    return if winner.current_spot == challenge.spot
    User.transaction do
      s = winner.current_spot
      winner.update_attributes!(current_spot: nil)
      loser.update_attributes!(current_spot: s)
      winner.update_attributes!(current_spot: challenge.spot)
    end
  end

  def self._switch_for_open_spot_challenge(challenge)
    user_challenges = challenge.user_challenges
    winner = user_challenges.select(&:first_place?).first.user
    user_who_had_spot = User.find_by(current_spot: challenge.spot)
    User.transaction do
      winner_spot = winner.current_spot
      user_who_had_spot.update_attributes!(current_spot: nil)
      winner.update_attributes!(current_spot: challenge.spot)
      user_who_had_spot.update_attributes!(current_spot: winner_spot)
    end
  end

  # The winner gets the lowest spot numerically
  # 2nd place gets the middle number
  # 3rd place gets the highest
  # rubocop:disable Metrics/MethodLength, Metrics/LineLength
  def self._switch_for_tri_challenge(challenge)
    user_challenges = challenge.user_challenges
    first_place = user_challenges.select(&:first_place?).first.user
    second_place = user_challenges.select(&:second_place?).first.user
    last_place = user_challenges.select(&:third_place?).first.user
    return if first_place.current_spot.file < second_place.current_spot.file && second_place.current_spot.file < last_place.current_spot.file
    spots = [first_place.current_spot, second_place.current_spot, last_place.current_spot].sort { |a, b| a.file - b.file }

    first_place.update_attributes!(current_spot: nil)
    second_place.update_attributes!(current_spot: nil)
    last_place.update_attributes!(current_spot: nil)

    first_place.update_attributes!(current_spot: spots.first)
    second_place.update_attributes!(current_spot: spots[1])
    last_place.update_attributes!(current_spot: spots.last)
  end
  # rubocop:enable Metrics/MethodLength, Metrics/LineLength

  # rubocop:disable Metrics/LineLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def self._sort_challenges(challenges)
    challenges.sort do |a, b|
      a_vacated_spot = a.users.any? { |u| u.discipline_actions.select { |da| da.performance == @performance && da.open_spot } }
      b_vacated_spot = b.users.any? { |u| u.discipline_actions.select { |da| da.performance == @performance && da.open_spot } }
      if a_vacated_spot && !b_vacated_spot
        1
      elsif !a_vacated_spot && b_vacated_spot
        -1
      end
      0
    end
  end
  # rubocop:enable Metrics/LineLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
end
