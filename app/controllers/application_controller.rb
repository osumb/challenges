class ApplicationController < ActionController::Base
  helper_method :current_user

  def ensure_authenticated!
    return if current_user
    redirect_to '/login'
  end

  def ensure_admin!
    return if current_user.admin?
    head :not_found
  end

  def ensure_not_authenticated!
    return unless current_user
    redirect_to '/logged_in'
  end

  def current_user
    if session[:buck_id]
      @current_user ||= User.find_by(buck_id: session[:buck_id])
    else
      @current_user = nil
    end
  end

  def send_back(flash = {}, fallback = nil)
    redirect_back(
      fallback_location: fallback.nil? ? '/logged_in' : fallback,
      flash: flash
    )
  end
end
