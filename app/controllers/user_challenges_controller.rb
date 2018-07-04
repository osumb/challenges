class UserChallengesController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_correct_user_for_delete!, only: [:destroy]

  def destroy
    user_challenge = UserChallenge.find(params[:id])
    result = ChallengeService.remove_user_from_challenge(
      challenge_id: user_challenge.challenge_id,
      user_buck_id: user_challenge.user_buck_id
    )

    if result.success?
      redirect_back fallback_location: '/logged_in'
    else
      head :bad_request
    end
  end

  private

  def ensure_correct_user_for_delete!
    return if current_user.admin?
    user_challenge = UserChallenge.find(params[:id])
    return if user_challenge.user_buck_id == current_user.buck_id
    head :forbidden
  end
end
