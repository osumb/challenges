class UserChallengesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_challenge_exists!, only: [:create]
  before_action :ensure_user_exists!, only: [:create]
  before_action :ensure_challenge_not_full!, only: [:create]
  before_action :ensure_correct_user_for_delete!, only: [:destroy]

  def create
    user = current_user
    challenge = Challenge.find_by id: params[:challenge_id]
    add_user_to_challenge user, challenge
  end

  def destroy
    uc = UserChallenge.includes(:challenge).find_by id: params[:id]
    challenge = uc.challenge

    if challenge.user_challenges.length <= 1 && uc.destroy && challenge.destroy
      head 204
    elsif uc.destroy
      head 204
    else
      render json: { resource: 'user_challenge', errors: [challenge: 'could not be destroyed'] }, status: 500
    end
  end

  private

  def ensure_challenge_exists!
    return unless Challenge.find_by(id: params[:challenge_id]).nil?
    render json: { resource: 'user_challenge', errors: [challenge: 'challenge doesn\'t exist'] }, status: 403
  end

  def ensure_user_exists!
    return unless User.find_by buck_id: params[:buck_id].nil?
    render json: { resource: 'user_challenge', errors: [user: 'user doesn\'t exist'] }, status: 403
  end

  def ensure_challenge_not_full!
    challenge = Challenge.includes(:users).find_by id: params[:challenge_id]
    return unless challenge.full?
    render json: { resource: 'user_challenge', errors: [challenge: 'challenge is already full'] }, status: 403
  end

  def ensure_correct_user_for_delete!
    user = current_user
    user_challenge = UserChallenge.includes(:user).find_by id: params[:id]
    return if user.admin?
    return if user_challenge.user.id == user.id
    render json: { resource: 'user_challenge', errors: [user: 'doesn\'t have access to that challenge'] }, status: 403
  end
end
