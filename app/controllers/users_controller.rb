class UsersController < ApplicationController
  def index
    @users = User.performers.includes(:spot)
  end
end
