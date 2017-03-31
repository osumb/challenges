json.user do
  json.partial! 'users/user', user: @user
end

json.can_challenge(@user.can_challenge_for_performance?(@next_performance))

if @next_performance.nil?
  json.next_performance nil
else
  json.next_performance do
    json.partial! 'performances/performance', performance: @next_performance
  end

  if !@user.challenges.last.nil? && @user.challenges.last.performance.id == @next_performance.id
    json.current_challenge do
      json.challenge_type @user.challenges.last.challenge_type
      json.id @user.challenges.last.id
      json.spot do
        json.partial! 'spots/spot', spot: @user.challenges.last.spot
      end
      json.user_challenge_id @user.challenges.last.user_challenges.select { |uc| uc.user.id == @user.id }.first&.id
    end
  else
    json.current_challenge nil
  end
end

if @user.discipline_actions.last.nil? || !@user.discipline_actions.last.performance.window_open?
  json.current_discipline_action nil
else
  json.current_discipline_action do
    json.partial! 'discipline_actions/discipline_action', discipline_action: @user.discipline_actions.last
  end
end
