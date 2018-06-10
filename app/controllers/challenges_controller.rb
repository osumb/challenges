class ChallengesController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_correct_create_params!, only: [:create]
  before_action :ensure_user_can_make_challenge!, only: [:create]
  before_action :log_challenge_creation_attempt, only: [:create]

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
    result = ChallengeCreationService.create_challenge(challenger: challenger, performance: Performance.next, spot: spot) # rubocop:disable Metrics/LineLength

    if result.success?
      log_challenge_creation_success(spot)
      send_challenge_success_email(challenger, result.challenge)
      redirect_to('/challenges/new', flash: { message: I18n.t!('client_messages.challenges.create.success') })
    else
      log_challenge_creation_error(spot, result.errors)
      redirect_to('/challenges/new', flash: { error: I18n.t!('client_messages.challenges.create.error') })
    end
  end

  private

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
