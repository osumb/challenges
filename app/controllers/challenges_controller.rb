class ChallengesController < ApplicationController # rubocop:disable Metrics/ClassLength
  before_action :ensure_authenticated!
  before_action :ensure_correct_create_params!, only: [:create]
  before_action :ensure_user_can_make_challenge!, only: [:create]
  before_action :log_challenge_creation_attempt, only: [:create]
  before_action :ensure_correct_update_type!, only: [:update]
  before_action :ensure_not_normal_performer!, only: %i[completed update]

  def new
    @result = if current_user.admin?
                AdminChallengeService.find_options_for_user(user_buck_id: params[:user_buck_id])
              else
                ChallengeOptionsService.find_for_user(user: current_user)
              end
  end

  def create # rubocop:disable Metrics/MethodLength
    spot = Spot.find_by(row: create_params['spot']['row'], file: create_params['spot']['file'])
    challenger = current_user.admin? ? User.find(create_params['challenger_buck_id']) : current_user
    result = ChallengeCreationService.create_challenge(
      challenger: challenger,
      performance: Performance.next,
      spot: spot
    )

    if result.success?
      log_challenge_creation_success(spot)
      send_challenge_success_email(challenger, result.challenge)
      redirect_to('/challenges/new', flash: { message: I18n.t!('client_messages.challenges.create.success') })
    else
      log_challenge_creation_error(spot, result.errors)
      redirect_to('/challenges/new', flash: { error: I18n.t!('client_messages.challenges.create.error') })
    end
  end

  def update # rubocop:disable Metrics/MethodLength
    result = ChallengeService.update(challenge_id: params['id'], user_challenge_param_hashes: update_params.map(&:to_h))

    if result.errors
      redirect_back(
        flash: { error: result.errors },
        fallback_location: '/challenges/evaluate'
      )
    elsif params['update_type'] == 'Save' && params['redirect_id'].present?
      redirect_to(
        "/challenges/evaluate?visible_challenge=#{params['redirect_id']}",
        flash: { message: I18n.t!('client_messages.challenges.evaluate.save') }
      )
    elsif params['update_type'] == 'Save'
      redirect_back(
        flash: { message: I18n.t!('client_messages.challenges.evaluate.save') },
        fallback_location: '/challenges/evaluate'
      )
    elsif params['update_type'] == 'Submit'
      ChallengeService.move_to_next_stage(challenge_id: params['id'])
      CheckOtherChallengesDoneJob.perform_later(challenge_id: params['id'])
      NotifyChallengeCompletionJob.perform_later(challenge_id: params['id'])
      redirect_to('/challenges/evaluate', flash: { message: I18n.t!('client_messages.challenges.evaluate.success') })
    end
  end

  def evaluate
    @challenges = Challenge.evaluable(current_user).select { |c| c.performance.stale? }.sort_by { |c| c.spot.to_s }
    @visible_challenge = @challenges.find { |c| c.id == params['visible_challenge'].to_i }
    @visible_challenge ||= @challenges.min_by { |c| c.spot.to_s } # rubocop:disable Naming/MemoizedInstanceVariableName
  end

  def completed
    @performance = if params['performance_id'].present?
                     Performance.find(params['performance_id'])
                   else
                     Performance.order(date: :desc).first
                   end
    @challenges = Challenge.completed(current_user).where(performance: @performance).order('spots.row, spots.file')
    @performances = Performance.order(date: :desc).all
  end

  private

  # Look at the spec for this file to see how the params are coming in
  def update_params
    challenge = Challenge.includes(:user_challenges).find(params['id'])
    required_user_challenges_attributes_keys = (0...challenge.user_challenges.count).to_a.map(&:to_s)
    user_challenge_params = params.require('challenge').require('user_challenges_attributes').require(
      required_user_challenges_attributes_keys
    )
    user_challenge_params.map { |param| param.permit(%w[comments id place]) }
  end

  def ensure_correct_create_params!
    return if current_user.admin?

    challenger_buck_id = create_params['challenger_buck_id']
    return if challenger_buck_id == current_user.buck_id
    redirect_to(
      '/challenges/new',
      flash: { error: I18n.t!('client_messages.challenges.create.unauthorized', buck_id: challenger_buck_id) }
    )
  end

  def ensure_user_can_make_challenge!
    challenger = current_user.admin? ? User.find(create_params['challenger_buck_id']) : current_user
    return if challenger.can_challenge_for_performance?(Performance.next)
    head :bad_request
  end

  def ensure_correct_update_type!
    return if %w[Save Submit].include?(params['update_type'])
    raise I18n.t!('errors.challenges.update.invalid_update_type', update_type: params['update_type'])
  end

  def ensure_not_normal_performer!
    return unless current_user.member?
    head :not_found
  end

  def log_challenge_creation_attempt
    Rails.logger.info(
      I18n.t!('logging.challenge.create.attempt', name: current_user.full_name, params: params['challenge-select'])
    )
  end

  def log_challenge_creation_success(spot)
    Rails.logger.info(
      I18n.t!('logging.challenge.create.success', name: current_user.full_name, spot: spot)
    )
  end

  def log_challenge_creation_error(spot, errors)
    Rails.logger.info(
      I18n.t!('logging.challenge.create.error', name: current_user.full_name, spot: spot, errors: errors)
    )
  end

  def send_challenge_success_email(challenger, challenge)
    EmailJob.perform_later(
      klass: 'ChallengeSuccessMailer',
      method: 'challenge_success_email',
      args: {
        challenge_id: challenge.id,
        email: challenger.email,
        initiator_buck_id: current_user.buck_id
      }
    )
  end

  def create_params
    JSON.parse(params.require('challenge-select'))
  end
end
