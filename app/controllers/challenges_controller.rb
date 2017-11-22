class ChallengesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_not_challenging_alternate!, only: [:create]
  before_action :ensure_performance_is_current_and_open!, only: [:create]
  before_action :ensure_user_can_submit_for_approval!, only: [:submit_evaluation]
  before_action :ensure_user_has_not_already_made_challenge!, only: [:create]
  before_action :ensure_user_is_challenging_correct_instrument_and_part!, only: [:create]
  before_action :ensure_spot_has_not_been_challenged!, only: [:create]

  # rubocop:disable Metrics/MethodLength, Metrics/LineLength
  def create
    performance = Performance.next
    spot = Spot.find_by(row: Spot.rows[params[:spot][:row].downcase], file: params[:spot][:file])
    @challenge = Challenge::Bylder.perform(challenger, performance, spot)
    Rails.logger.info "CHALLENGE_LOG: #{current_user.full_name} attempted to challenge the #{spot&.to_s} spot"

    if @challenge.save
      Rails.logger.info "CHALLENGE_LOG: #{current_user.full_name} successfully challenged the #{spot&.to_s} spot"
      send_challenge_success_email
      render :show, status: 201
    else
      Rails.logger.info "CHALLENGE_LOG: #{current_user.full_name} couldn't challenge #{spot&.to_s}. Errors: #{@challenge.errors}"
      render json: { resource: 'challenge', errors: @challenge.errors }, status: 409
    end
  end
  # rubocop:enable Metrics/MethodLength, Metrics/LineLength

  def for_evaluation
    @challenges = Challenge.evaluable(current_user)
    @challenges = @challenges.select { |c| c.performance.stale? }
    render :index, status: :ok
  end

  def completed
    @challenges = Challenge.completed(current_user)

    render :for_evaluation_or_update, status: :ok
  end

  def submit_evaluation
    challenge = Challenge.find(params[:id])

    if challenge.update(stage: :done)
      CheckOtherChallengesDoneJob.perform_later(challenge_id: challenge.id)
      head :no_content
    else
      render json: { resource: 'challenge', errors: challenge.errors }, status: :conflict
    end
  end

  private

  def send_challenge_success_email
    EmailJob.perform_later(
      klass: 'ChallengeSuccessMailer',
      method: 'challenge_success_email',
      args: {
        challenge_id: @challenge.id,
        initiator_buck_id: current_user.buck_id,
        email: challenger.email
      }
    )
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
    challengee = User.find_by current_spot: spot
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
    performance = Performance.next
    challenge = Challenge.find_by(spot: spot, performance: performance)
    return if challenge.nil?
    return if challenge.open_spot_challenge_type? && challenge.users.length < 2
    render json: { resource: 'challenge', errors: [spot: 'spot has already been challenged'] }, status: 403
  end

  def ensure_user_can_submit_for_approval!
    return if Challenge.evaluable(current_user).where(id: params[:id]).exists?
    render json: {
      resource: 'challenge',
      errors: [challenge: 'not authenticated to submit challenge for approval']
    }, status: :unauthorized
  end
end
