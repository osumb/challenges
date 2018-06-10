json.spot do
  json.partial! 'api/spots/spot', spot: @spot
end
json.current_user do
  json.partial! 'api/users/user', user: @spot.current_user
end
