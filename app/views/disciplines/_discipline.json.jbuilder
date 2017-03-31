json.id discipline.id
json.reason discipline.reason
json.open_spot discipline.open_spot
json.allowed_to_challenge discipline.allowed_to_challenge
json.performance do
  json.partial! 'performances/performance', performance: discipline.performance
end
json.user_buck_id discipline.user.buck_id
