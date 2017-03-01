class UsersController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!

  def index
    @users = User.performers.includes(:spot)
  end

  private

  def ensure_admin!
    return if current_user.admin? || current_user.director?
    head 401
  end
end
