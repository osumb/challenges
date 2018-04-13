class ApplicationController < ActionController::Base
  def ensure_authenticated!
    return if current_user
    redirect_to '/login'
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
end
