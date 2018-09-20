class ChallengeCreationService
  ChallengeAlreadyFullError = Class.new(StandardError)

  def self.create_challenge(challenger:, performance:, spot:)
    new(challenger, performance, spot).perform
  end

  def initialize(challenger, performance, spot)
    @challenger = challenger
    @performance = performance
    @spot = spot
    @challenge = nil
  end

  def perform
    type = _challenge_type_from_spot(@spot, @performance)
    users = _get_users_involved_in_challenge(@challenger, type, @spot, @performance)
    @challenge = _create_or_update(@performance, @spot, type, users)
    _result
  rescue ChallengeAlreadyFullError
    _error([I18n.t!("errors.challenges.create.challenge_already_full", spot: @spot.to_s)])
  end

  private

  def _result
    @challenge.save
    OpenStruct.new(
      success?: @challenge.valid?,
      challenge: @challenge,
      errors: @challenge.errors.full_messages
    )
  end

  def _error(errors = ["Error creating challenge"])
    OpenStruct.new(success?: false, errors: errors)
  end

  def _create_or_update(performance, spot, type, users)
    challenge = Challenge.find_by(performance: performance, spot: spot)
    raise ChallengeAlreadyFullError if challenge&.full?
    if challenge.nil?
      _create(performance, spot, type, users)
    else
      _update(challenge, users)
    end
  end

  def _create(performance, spot, type, users)
    challenge = Challenge.new(performance: performance, spot: spot, challenge_type: type, users: users)
    challenge.user_challenges.each { |uc| uc.spot = uc.user.current_spot }
    challenge
  end

  def _update(challenge, users)
    new_user = users.reject { |u| challenge.users.include? u }.first
    challenge.user_challenges.create(user: new_user, spot: new_user.current_spot)
    challenge
  end

  def _challenge_type_from_spot(spot, performance)
    spot_user_das = spot.current_user.discipline_actions.select { |da| da.performance.id == performance.id }
    if Challenge.tri_challenge_rows.include? spot.row.downcase.to_sym
      Challenge.challenge_types[:tri]
    elsif spot_user_das.last&.open_spot
      Challenge.challenge_types[:open_spot]
    else
      Challenge.challenge_types[:normal]
    end
  end

  def _get_users_involved_in_challenge(challenger, type, spot, performance) # rubocop:disable Metrics/MethodLength
    users = [challenger]
    if type == Challenge.challenge_types[:normal]
      users << _associated_user_for_normal_challenge(spot)
    elsif type == Challenge.challenge_types[:tri]
      users << _associated_users_for_tri_challenge(challenger, spot)
    elsif type == Challenge.challenge_types[:open_spot]
      new_user = _associated_user_for_open_spot_challenge(spot, performance)
      users << [new_user] unless new_user.nil?
    else
      raise I18n.t1!("errors.unexpected_value", variable_name: "challenge type", value: type)
    end
    users.flatten
  end

  def _associated_user_for_normal_challenge(spot)
    spot.current_user
  end

  def _associated_users_for_tri_challenge(challenger, spot)
    regular_user = spot.current_user
    other_alternate = User.joins("LEFT OUTER JOIN spots on spots.id = users.current_spot_id").find_by(
      "instrument = ? and part = ? and buck_id != ? and file > 12",
      User.instruments[challenger.instrument],
      User.parts[challenger.part],
      challenger.buck_id
    )
    [regular_user, other_alternate]
  end

  def _associated_user_for_open_spot_challenge(spot, performance)
    (Challenge.find_by(performance: performance, spot: spot)&.users || []).first
  end
end
