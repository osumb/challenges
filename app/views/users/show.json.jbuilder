json.user do
  json.partial! 'users/user', user: @user
end
json.disciplineActions do
  json.array! @user.discipline_actions.each do |da|
    json.partial! 'discipline_actions/discipline_action', discipline_action: da
  end
end
json.pastChallenges do
  json.array! @user.challenges.select { |c| c.performance.id != @performance&.id }.each do |c|
    json.partial! 'challenges/challenge', challenge: c
  end
end
if @performance.nil?
  json.performance nil
  json.currentChallenge nil
else
  json.performance do
    json.partial! 'performances/performance', performance: @performance
  end
  if !@user.challenges.last&.performance.nil? && @user.challenges.last.performance.id == @performance.id
    last_challenge = @user.challenges.last
    json.currentChallenge do
      json.partial! 'challenges/challenge', challenge: last_challenge
      json.spot do
        json.partial! 'spots/spot', spot: last_challenge.spot
      end
    end
  else
    json.currentChallenge nil
  end
end
