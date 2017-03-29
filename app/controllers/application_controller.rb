# frozen_string_literal: true
class ApplicationController < ActionController::API
  include Knock::Authenticable

  def add_user_to_challenge(user, challenge)
    @user_challenge = UserChallenge.new user: user, challenge: challenge, spot: user.spot

    if @user_challenge.save
      render 'user_challenges/show', status: 201
    else
      render json: { resource: 'user_challenge', errors: @user_challenge.errors }, status: 409
    end
  end
end
