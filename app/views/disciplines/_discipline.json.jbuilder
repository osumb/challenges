json.id discipline.id
json.reason discipline.reason
json.openSpot discipline.open_spot
json.allowedToChallenge discipline.allowed_to_challenge
json.performance do
  json.partial! 'performances/performance', performance: discipline.performance
end
json.userBuckId discipline.user.buck_id
