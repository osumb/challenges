class AdminChallengeService
  def self.find_options_for_user(user_buck_id: nil)
    new(user_buck_id).evaluate
  end

  def initialize(user_buck_id)
    @user = user_buck_id.nil? ? nil : User.find(user_buck_id)
    @next_performance = Performance.next
    @users_who_can_challenge = []
    @challenge_options = []
  end

  def evaluate
    return _result if @next_performance.nil?
    @users_who_can_challenge = User.includes(:challenges, :discipline_actions, :current_spot)
                                   .performers.select { |u| u.can_challenge_for_performance? @next_performance }
    @challenge_options = ChallengeOptionsService.find_for_user(user: @user).challenge_options unless @user.nil?
    _result
  end

  private

  def _result
    OpenStruct.new(
      challenge_options: @challenge_options,
      next_performance: @next_performance,
      user: @user,
      users_who_can_challenge: @users_who_can_challenge
    )
  end
end
