class ChallengesController < ApplicationController
  before_action :ensure_authenticated!

  def new
    @result = if current_user.admin?
                AdminChallengeService.find_options_for_user(user_buck_id: params[:user_buck_id])
              else
                ChallengeOptionsService.find_for_user(user: current_user)
              end
  end
end
