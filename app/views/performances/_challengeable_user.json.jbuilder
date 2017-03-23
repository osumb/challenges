json.buckId user[:buck_id]
json.challengeId user[:challenge_id]
json.challengeType Challenge.challenge_types.key(user[:challenge_type])
json.file user[:file]
json.firstName user[:first_name]
json.lastName user[:last_name]
json.openSpot(user[:open_spot].nil? ? false : user[:open_spot])
json.row Spot.rows.key(user[:row]).upcase
json.timesChallenged user[:times_challenged]
