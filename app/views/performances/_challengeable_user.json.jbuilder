json.buck_id user[:buck_id]
json.challenge_id user[:challenge_id]
json.challenge_type Challenge.challenge_types.key(user[:challenge_type])
json.file user[:file]
json.first_name user[:first_name]
json.last_name user[:last_name]
json.open_spot(user[:open_spot].nil? ? false : user[:open_spot])
json.row Spot.rows.key(user[:row]).upcase
json.members_in_challenge user[:members_in_challenge]
