json.id @user_challenge.id
json.comments @user_challenge.comments
json.user_id @user_challenge.user.id
json.challenge_id @user_challenge.challenge.id
json.challenge_spot do
  json.partial! 'spots/spot', spot: @user_challenge.challenge.spot
end
json.spot do
  json.partial! 'spots/spot', spot: @user_challenge.spot
end
