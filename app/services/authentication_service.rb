module AuthenticationService
  def self.authenticate_user(params, session)
    user = User.find_by(buck_id: params[:buck_id])&.authenticate(params[:password])
    if user
      session[:buck_id] = user.buck_id
      user.authenticate(params[:password])
    else
      fake_password_check(params[:password])
    end
  end

  def self.log_out_user(session)
    session[:buck_id] = nil
  end

  def self.fake_password_check(password)
    User.new(password: password).authenticate(password)
    nil
  end
end
