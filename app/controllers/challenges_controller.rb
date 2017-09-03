# rubocop:disable Metrics/ClassLength
class ChallengesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_not_challenging_alternate!, only: [:create]
  before_action :ensure_performance_is_current_and_open!, only: [:create]
  before_action :ensure_user_can_submit_for_approval!, only: [:submit_for_approval]
  before_action :ensure_user_has_not_already_made_challenge!, only: [:create]
  before_action :ensure_user_is_challenging_correct_instrument_and_part!, only: [:create]
  before_action :ensure_spot_has_not_been_challenged!, only: [:create]
  before_action :ensure_admin!, only: [:approve]
  before_action :ensure_challenge_is_needs_approval!, only: [:disapprove]

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

  def for_approval
    @challenges = Challenge.includes(:users, :user_challenges).where(stage: :needs_approval)

    render :index, status: :ok
  end

  def for_evaluation
    @challenges = Challenge.evaluable(current_user)
    @challenges = @challenges.select { |c| c.performance.stale? }
    render :index, status: :ok
  end

  def completed
    @challenges = Challenge.completed(current_user)

    render :for_evaluation_or_update, status: :ok
  end

  def submit_for_approval
    challenge = Challenge.find(params[:id])

    if challenge.update(stage: :needs_approval)
      head :no_content
    else
      render json: { resource: 'challenge', errors: challenge.errors }, status: :conflict
    end
  end

  # rubocop:disable Metrics/MethodLength
  def approve
    challenge = Challenge.find(params[:id])

    if challenge.update(stage: :done)
      if challenge.performance.challenges.all?(&:done_stage?)
        switcher = Challenge::SpotSwitcher.new(challenge.performance)
        begin
          switcher.run!
          SpotSwitchMailer.spot_switch_email.deliver_now
        rescue StandardError => e
          SpotSwitchMailer.spot_switch_email(e.messsage).deliver_now
        end
      end
      head :no_content
    else
      render json: { resource: 'challenge', errors: challenge.errors }, status: :conflict
    end
  end
  # rubocop:enable Metrics/MethodLength

  def disapprove
    challenge = Challenge.find(params[:id])

    if challenge.update(stage: :needs_comments)
      head :no_content
    else
      render json: { resource: 'challenge', errors: challenge.errors }, status: :conflict
    end
  end

  private

  def send_challenge_success_email
    ChallengeSuccessMailer.challenge_success_email(
      challenge: @challenge,
      initiated_by: current_user,
      email: challenger.email
    ).deliver_now
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

  def ensure_challenge_is_needs_approval!
    return if Challenge.find(params[:id]).needs_approval_stage?
    render json: {
      resource: 'challenge',
      errors: [challenge: 'can disapprove a challenge not up for approval']
    }, status: :conflict
  end
end
