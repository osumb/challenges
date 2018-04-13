class SessionsController < ApplicationController
  before_action :ensure_authenticated!, only: %I[show destroy]
  before_action :ensure_not_authenticated!, only: %I[new create]

  def new; end

  def show; end

  def create
    user = AuthenticationService.authenticate_user(create_params)

    if user
      session[:buck_id] = user.buck_id
      flash[:error] = nil
      redirect_to '/logged_in'
    else
      flash.now[:error] = I18n.t!('authentication.failed_login')
      render 'new'
    end
  end

  def destroy
    session[:buck_id] = nil
    redirect_to '/login'
  end

  private

  def create_params
    params.permit(:buck_id, :password)
  end
end
