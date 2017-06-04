class ChallengesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_not_challenging_alternate!, only: [:create]
  before_action :ensure_performance_is_current_and_open!, only: [:create]
  before_action :ensure_user_has_not_already_made_challenge!, only: [:create]
  before_action :ensure_user_is_challenging_correct_instrument_and_part!, only: [:create]
  before_action :ensure_spot_has_not_been_challenged!, only: [:create]
  before_action :ensure_enough_users_exist_for_tri_challenge!, only: [:create]

  def create
    @challenge = Challenge::Bylder.perform(
      challenger,
      Performance.next,
      Spot.find_by(row: Spot.rows[params[:spot][:row].downcase], file: params[:spot][:file])
    )
    if @challenge.save
      render :show, status: 201
    else
      render json: { resource: 'challenge', errors: @challenge.errors }, status: 409
    end
  end

  private

  def challenger
    current_user.admin? ? User.find(params[:challenger_buck_id]) : current_user
  end

  def ensure_not_challenging_alternate!
    return if params[:spot][:file] < 13
    render json: { resource: 'challenge', errors: [challenge: 'can\'t challenge alternate'] }, status: 403
  end

  def ensure_performance_is_current_and_open!
    next_performance = Performance.next
    return if next_performance&.window_open?
    render json: { resource: 'challenge', errors: [performance: 'window not open'] }, status: 403
  end

  def ensure_user_has_not_already_made_challenge!
    user = current_user
    p = Performance.next
    challenges = user.challenges
    return unless challenges.any? { |c| c.performance.id == p.id }
    render json: { resouce: 'challenge', errors: [user: 'can\'t make more than one challenge'] }, status: 403
  end

  def ensure_user_is_challenging_correct_instrument_and_part!
    spot = Spot.find_by(row: Spot.rows[params[:spot][:row].downcase], file: params[:spot][:file])
    challengee = User.find_by spot: spot
    return if challenger.instrument == challengee.instrument && challenger.part == challengee.part
    render(
      json: {
        resource: 'challenge',
        errors: [user: 'can\'t challenge someone of a different instrument or part']
      },
      status: 403
    )
  end

  def ensure_spot_has_not_been_challenged!
    spot = Spot.find_by(row: Spot.rows[params[:spot][:row].downcase], file: params[:spot][:file])
    challenge = Challenge.find_by(spot: spot)
    return if challenge.nil?
    return if challenge.open_spot_challenge_type?
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
end
