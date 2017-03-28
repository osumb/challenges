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

    if challenge.open_spot_challenge_type?
      remove_user_from_open_spot_challenge uc
    else
      remove_user_from_non_open_spot_challenge uc
    end
  end

  private

  def remove_user_from_open_spot_challenge(user_challenge)
    challenge = user_challenge.challenge
    if challenge.users.length <= 1 && user_challenge.destroy && challenge.destroy
      head 204
    elsif user_challenge.destroy
      head 204
    else
      render json: { resource: 'user_challenge', errors: [challenge: 'could not be destroyed'] }, status: 500
    end
  end

  def remove_user_from_non_open_spot_challenge(user_challenge)
    challenge = user_challenge.challenge
    if challenge.destroy
      head 204
    else
      render json: { resource: 'user_challenge', errors: [challenge: 'could not be destroyed'] }, status: 500
    end
  end

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
    return if user.admin?
    user_challenge = UserChallenge.includes(:user).find_by id: params[:id]
    challenge = user_challenge.challenge
    return if UserChallenge.can_user_remove_self_from_challenge? user, challenge, user_challenge
    render json: { resource: 'user_challenge', errors: [user: 'doesn\'t have access to that challenge'] }, status: 403
  end
end
