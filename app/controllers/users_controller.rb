class UsersController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!, except: [:show]
  before_action :ensure_correct_user!, only: [:show]

  def index
    @users = User.performers.includes(:spot)
  end

  def show
    @user = User.includes(:spot, :challenges, :disciplines).find_by(buck_id: params[:id])
    return unless @user.nil?
    head 404
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
