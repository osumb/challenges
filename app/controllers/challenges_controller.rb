# rubocop:disable Metrics/ClassLength
class ChallengesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_performance_is_current_and_open!, only: [:create]
  before_action :ensure_user_is_challenging_correct_instrument_and_part!, only: [:create]
  before_action :ensure_spot_has_not_been_challenged!, only: [:create]
  before_action :ensure_enough_users_exist_for_tri_challenge!, only: [:create]
  before_action :ensure_correct_user_for_delete!, only: [:destroy]

  # rubocop:disable Metrics/MethodLength
  def create
    user = current_user
    performance = Performance.next
    spot = Spot.find_by row: Spot.rows[params[:row].downcase], file: params[:file]
    challenge_type = Challenge.challenge_types[params[:challenge_type]]
    @challenge = if user.admin?
                   nil # admin_create_challenge performance TODO: lol
                 elsif challenge_type == Challenge.challenge_types[:normal]
                   create_normal_challenge user, performance, spot
                 elsif challenge_type == Challenge.challenge_types[:open_spot]
                   create_open_spot_challenge user, performance, spot
                 else
                   create_tri_challenge user, performance, spot
                 end

    if @challenge.save
      render :show, status: 201
    else
      render json: { resource: 'challenge', errors: @challenge.errors }, status: 409
    end
  end
  # rubocop:enable Metrics/MethodLength

  def destroy
    challenge = Challenge.find_by id: params[:id]

    if challenge.destroy
      head 204
    else
      render json: { resource: 'challenge', errors: [challenge: 'could not be destroyed'] }, status: 500
    end
  end

  private

  def create_open_spot_challenge(user, performance, spot)
    challenge = Challenge.new(
      spot: spot,
      performance: performance,
      challenge_type: Challenge.challenge_types[:open_spot]
    )
    challenge.users << user
    challenge.user_challenges[0].spot = user.spot
    challenge
  end

  def create_normal_challenge(user, performance, spot)
    challengee = User.includes(:spot).find_by spot: spot
    challenge = Challenge.new(
      spot: spot,
      performance: performance,
      challenge_type: Challenge.challenge_types[:normal]
    )
    challenge.users << [user, challengee]
    challenge.user_challenges[0].spot = user.spot
    challenge.user_challenges[1].spot = challengee.spot
    challenge
  end

  # rubocop:disable Metrics/MethodLength
  def create_tri_challenge(user, performance, spot)
    member_holding_spot = User.find_by spot: spot
    other_members = User.includes(:spot).where(
      'instrument = ? and part = ? and buck_id != ?',
      User.instruments[user.instrument],
      User.parts[user.part],
      user.buck_id
    )
    other_alternate = other_members.select { |member| member.spot.file > 12 }.first
    challenge = Challenge.new(
      spot: spot,
      performance: performance,
      challenge_type: Challenge.challenge_types[:tri]
    )
    challenge.users << [user, member_holding_spot, other_alternate]
    challenge.user_challenges[0].spot = user.spot
    challenge.user_challenges[1].spot = member_holding_spot.spot
    challenge.user_challenges[2].spot = other_alternate.spot
    challenge
  end
  # rubocop:enable Metrics/MethodLength

  def ensure_performance_is_current_and_open!
    next_performance = Performance.next
    request_performance = Performance.find_by(id: params[:performance_id])
    return if params[:performance_id] == next_performance&.id
    return if request_performance&.window_open?
    render json: { resource: 'challenge', errors: [performance: 'window not open'] }, status: 403
  end

  def ensure_user_is_challenging_correct_instrument_and_part!
    spot = Spot.find_by(row: Spot.rows[params[:row].downcase], file: params[:file])
    challengee = User.find_by spot: spot
    return if current_user.instrument == challengee.instrument && current_user.part == challengee.part
    render(
      json: {
        resource: 'challenge',
        errors: [user: 'can\'t challenge someone of a different instrument or part']
      },
      status: 403
    )
  end

  def ensure_spot_has_not_been_challenged!
    spot = Spot.find_by(row: Spot.rows[params[:row].downcase], file: params[:file])
    return if Challenge.find_by(spot: spot).nil?
    render json: { resource: 'challenge', errors: [spot: 'spot has already been challenged'] }, status: 403
  end

  # rubocop:disable Metrics/MethodLength
  def ensure_enough_users_exist_for_tri_challenge!
    c_type = Challenge.challenge_types[params[:challenge_type]]
    return if c_type == Challenge.challenge_types[:normal] || c_type == Challenge.challenge_types[:open_spot]
    user = current_user
    other_members = User.includes(:spot).where(
      'instrument = ? and part = ? and buck_id != ?',
      User.instruments[user.instrument],
      User.parts[user.part],
      user.buck_id
    )
    other_alternate = other_members.select { |member| member.spot.file > 12 }.first
    return unless other_alternate.nil?
    render json: { resource: 'challenge', errors: [user: 'not enough users for tri challenge'] }, status: 403
  end
  # rubocop:enable Metrics/MethodLength

  def ensure_correct_user_for_delete!
    user = current_user
    challenge = Challenge.find_by id: params[:id]
    return if user.admin?
    return if user.challenges.any? { |c| c.id == challenge.id }
    render json: { resource: 'challenge', errors: [user: 'doesn\'t have access to that challenge'] }, status: 403
  end
end
