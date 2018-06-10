class SessionsController < ApplicationController
  before_action :ensure_authenticated!, only: %I[show destroy]
  before_action :ensure_not_authenticated!, only: %I[new create]

  def new; end

  def show; end

  def create
    user = AuthenticationService.authenticate_user(create_params, session)

    if user
      flash[:error] = nil
      redirect_to '/logged_in'
    else
      flash.now[:error] = I18n.t!('authentication.failed_login')
      render 'new', status: :unauthorized
    end
  end

  def destroy
    AuthenticationService.log_out_user(session)
    redirect_to '/login'
  end

  private

  def create_params
    params.permit(:buck_id, :password)
  end
end
