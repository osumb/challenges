class SessionsController < ApplicationController
  before_action :ensure_authenticated!, only: %I[show destroy]
  before_action :ensure_not_authenticated!, only: %I[new create]

  def new; end

  def show
    return unless current_user.performer?
    @performance = Performance.next
    last_user_challenge = UserChallenge.where(user_buck_id: current_user.buck_id).last
    last_challenge = last_user_challenge&.challenge
    @current_challenge = last_challenge if can_current_user_see_challenge_in_profile?(last_challenge, @performance)
    @current_user_challenge = last_user_challenge unless @current_challenge.nil?
    @current_discipline_action = DisciplineAction.find_by(user: current_user, performance: @performance)
    @challenges = current_user.challenges.where.not(id: @current_challenge&.id).select(&:done_stage?)
  end

  def create
    user = AuthenticationService.authenticate_user(create_params, session)

    if user
      flash[:error] = nil
      redirect_to '/logged_in'
    else
      flash.now[:error] = I18n.t!('authentication.failed_login')
      render 'new', status: :unauthorized
    end
  end

  def destroy
    AuthenticationService.log_out_user(session)
    redirect_to '/login'
  end

  private

  def create_params
    params.permit(:buck_id, :password)
  end

  def can_current_user_see_challenge_in_profile?(challenge, performance)
    return false if challenge.nil? || performance.nil?
    return false if challenge.performance_id != performance.id
    challenge.spot_id != current_user.current_spot_id
  end
end
