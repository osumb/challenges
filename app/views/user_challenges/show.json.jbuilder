json.id @user_challenge.id
json.comments @user_challenge.comments
json.userId @user_challenge.user.id
json.challengeId @user_challenge.challenge.id
json.challengeSpot do
  json.partial! 'spots/spot', spot: @user_challenge.challenge.spot
end
json.spot do
  json.partial! 'spots/spot', spot: @user_challenge.spot
end
