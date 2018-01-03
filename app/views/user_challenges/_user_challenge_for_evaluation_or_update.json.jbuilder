json.id user_challenge.id
json.comments user_challenge.comments
json.place UserChallenge.places[user_challenge.place]
json.userBuckId user_challenge.user.id
json.challengeId user_challenge.challenge.id
json.user do
  json.partial! 'users/user', user: user_challenge.user
end
json.spot do
  json.partial! 'spots/spot', spot: user_challenge.spot
end
