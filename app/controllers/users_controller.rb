class UsersController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!, except: [:profile]
  before_action :ensure_correct_user!, only: [:profile]

  def index
    @users = User.performers.includes(:spot)
  end

  def show
    @user = User.includes(:spot, :challenges, :discipline_actions).find_by(buck_id: params[:id])
    return unless @user.nil?
    head 404
  end

  def profile
    @user = User.includes(:spot, :challenges, :discipline_actions).find_by(buck_id: current_user.buck_id)
    @next_performance = Performance.next
  end

  private

  def ensure_admin!
    return if current_user.admin? || current_user.director?
    head 401
  end

  def ensure_correct_user!
    return if current_user.admin? || current_user.director?
    return if params[:id]&.downcase == current_user&.buck_id&.downcase
    head 401
  end
end
