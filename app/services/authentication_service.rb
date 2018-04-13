module AuthenticationService
  def self.authenticate_user(params)
    user = User.find_by(buck_id: params[:buck_id])&.authenticate(params[:password])
    if user
      user.authenticate(params[:password])
    else
      fake_password_check(params[:password])
    end
  end

  def self.fake_password_check(password)
    User.new(password: password).authenticate(password)
    nil
  end
end
