json.spot do
  json.partial! 'spots/spot', spot: @spot
end
json.current_user do
  json.partial! 'users/user', user: @spot.current_user
end
