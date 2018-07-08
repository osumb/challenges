class ChallengesController < ApplicationController # rubocop:disable Metrics/ClassLength
  before_action :ensure_authenticated!
  before_action :ensure_correct_create_params!, only: [:create]
  before_action :ensure_user_can_make_challenge!, only: [:create]
  before_action :log_challenge_creation_attempt, only: [:create]
  before_action :ensure_correct_update_type!, only: [:update]
  before_action :ensure_places_are_valid!, only: [:update]

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

  def update # rubocop:disable Metrics/MethodLength, Metrics/PerceivedComplexity
    result = UserChallengeService.update(user_challenge_hashes: update_params.map(&:to_h))

    if result.success? && params['update_type'] == 'Save' && params['redirect_id'].present?
      redirect_to(
        "/challenges/evaluate?visible_challenge=#{params['redirect_id']}",
        flash: { message: I18n.t!('client_messages.challenges.evaluate.save') }
      )
    elsif result.success? && params['update_type'] == 'Save'
      redirect_back(
        flash: { message: I18n.t!('client_messages.challenges.evaluate.save') },
        fallback_location: '/challenges/evaluate'
      )
    elsif result.success? && params['update_type'] == 'Submit'
      ChallengeService.move_to_next_stage(challenge_id: params['id'])
      CheckOtherChallengesDoneJob.perform_later(challenge_id: params['id'])
      redirect_to('/challenges/evaluate', flash: { message: I18n.t!('client_messages.challenges.evaluate.success') })
    else
      redirect_back(
        flash: { error: result.errors },
        fallback_location: '/challenges/evaluate'
      )
    end
  end

  def evaluate
    @challenges = Challenge.evaluable(current_user).select { |c| c.performance.stale? }.sort_by { |c| c.spot.to_s }
    @visible_challenge = @challenges.find { |c| c.id == params['visible_challenge'].to_i }
    @visible_challenge ||= @challenges.min_by { |c| c.spot.to_s } # rubocop:disable Naming/MemoizedInstanceVariableName
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

  def ensure_places_are_valid! # rubocop:disable Metrics/MethodLength
    challenge = Challenge.find(params['id'])
    submitted_places = update_params.map { |param| param['place'] }.uniq.sort.map(&:to_i)
    required_places = challenge.required_user_challenge_places.sort
    return if submitted_places == required_places
    missing_places = required_places - submitted_places
    flash_message = I18n.t!(
      'client_messages.challenges.evaluate.invalid_user_challenge_places',
      places: required_places,
      missing: missing_places
    )
    redirect_back(flash: { error: flash_message }, fallback_location: '/challenges/evaluate')
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
