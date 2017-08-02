json.id challenge.id
json.challenge_type challenge.challenge_type
json.spot do
  json.partial! 'spots/spot', spot: challenge.spot
end
json.users do
  json.array! challenge.users.each do |user|
    json.partial! 'users/user', user: user
  end
end
json.user_challenges do
  json.array! challenge.user_challenges.each do |user_challenge|
    json.partial! 'user_challenges/user_challenge_for_evaluation', user_challenge: user_challenge
  end
end
json.performance do
  json.partial! 'performances/performance', performance: challenge.performance
end
