json.id user_challenge.id
json.comments user_challenge.comments
json.userBuckId user_challenge.user.id
json.challengeId user_challenge.challenge.id
json.challenge_spot do
  json.partial! "api/spots/spot", spot: user_challenge.challenge.spot
end
json.spot do
  json.partial! "api/spots/spot", spot: user_challenge.spot
end
json.place UserChallenge.places[user_challenge.place]
