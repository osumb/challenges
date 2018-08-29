module AuthenticationService
  def self.authenticate_user(params, session)
    user = User.find_by(buck_id: params[:buck_id]&.downcase)&.authenticate(params[:password])
    if user
      session[:buck_id] = user.buck_id
      user.authenticate(params[:password])
    else
      fake_password_check
    end
  end

  def self.log_out_user(session)
    session[:buck_id] = nil
  end

  def self.fake_password_check
    User.new(password: " ").authenticate(" ")
    nil
  end
end
