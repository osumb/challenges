module AuthenticationService
  def self.authenticate_user(params)
    User.find_by(buck_id: params[:buck_id])&.authenticate(params[:password])
  end
end
