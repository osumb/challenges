json.user do
  json.partial! 'users/user', user: @user
end

json.canChallenge(@user.can_challenge_for_performance?(@next_performance))

if @next_performance.nil?
  json.nextPerformance nil
else
  json.nextPerformance do
    json.partial! 'performances/performance', performance: @next_performance
  end

  if !@user.challenges.last.nil? && @user.challenges.last.performance.id == @next_performance.id
    json.currentChallenge do
      json.challengeType @user.challenges.last.challenge_type
      json.id @user.challenges.last.id
      json.spot do
        json.partial! 'spots/spot', spot: @user.challenges.last.spot
      end
      json.userChallengeId @user.challenges.last.user_challenges.select { |uc| uc.user.id == @user.id }.first&.id
    end
  else
    json.currentChallenge nil
  end
end

if @user.disciplines.last.nil?
  json.currentDiscipline nil
else
  json.currentDiscipline do
    json.partial! 'disciplines/discipline', discipline: @user.disciplines.last
  end
end
