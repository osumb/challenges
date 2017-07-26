class UserChallengesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_challenge_exists!, only: [:create]
  before_action :ensure_user_exists!, only: [:create]
  before_action :ensure_challenge_not_full!, only: [:create]
  before_action :ensure_correct_user_for_delete!, only: [:destroy]
  before_action :ensure_user_can_evaluate, only: [:evaluate_comments, :evaluate_places]

  def create
    challenge = Challenge.find_by id: params[:challenge_id]
    @user_challenge = UserChallenge.new(user: challenger, challenge: challenge, spot: challenger.spot)

    if @user_challenge.save
      render 'user_challenges/show', status: 201
    else
      render json: { resource: 'user_challenge', errors: @user_challenge.errors }, status: 409
    end
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

  def evaluate_comments
    evaluator = UserChallenge::Evaluator.new(params: params)
    result = evaluator.save_comments

    if result.success?
      head :no_content
    else
      render json: { resource: 'user_challenge', errors: [user_challenge: result.errors.first] }, status: 500
    end
  end

  def evaluate_places
    evaluator = UserChallenge::Evaluator.new(params: params)
    result = evaluator.save_places

    if result.success?
      head :no_content
    else
      render json: { resource: 'user_challenge', errors: [user_challenge: result.errors.first] }, status: 500
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

  def ensure_user_can_evaluate
    challenge = UserChallenge.find(params[:user_challenges].first.try(:[], :id)).challenge
    return if challenge.can_be_evaluated_by?(user: current_user)
    render json: {
      resource: 'user_challenge',
      errors: [user: 'doesn\'t have permission to update that challenge']
    }, status: :unauthorized
  end
end
