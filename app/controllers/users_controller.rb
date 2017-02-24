class UsersController < ApplicationController
  def index
    @users = User.performers
  end
end
