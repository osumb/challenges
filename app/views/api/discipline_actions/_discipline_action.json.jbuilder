json.id discipline_action.id
json.reason discipline_action.reason
json.open_spot discipline_action.open_spot
json.allowed_to_challenge discipline_action.allowed_to_challenge
json.performance do
  json.partial! 'api/performances/performance', performance: discipline_action.performance
end
json.user_buck_id discipline_action.user.buck_id
