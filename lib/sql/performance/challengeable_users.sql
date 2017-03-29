/*
  We need the following information to determine of a user is able to be challenged:
    - Their spot file (file < 13)
    - How many members are already involved in the challenge
  Also needed are any discipline actions associated with the current user
    - If the user's spot has been opened, that information needs to be known to the user
*/
SELECT
  s.row,
  s.file,
  c.challenge_type,
  c.id as challenge_id,
  users_disciplines.buck_id,
  users_disciplines.first_name,
  users_disciplines.last_name,
  users_disciplines.open_spot,
  count(uc.id) AS members_in_challenge
FROM spots AS s
LEFT OUTER JOIN (
  SELECT *
  FROM challenges
  WHERE performance_id = %{performance_id}
) c ON s.id = c.spot_id
JOIN (
  SELECT *
  FROM users
  LEFT OUTER JOIN (
    SELECT *
    FROM disciplines
    WHERE performance_id = %{performance_id}
  ) disciplines_for_performance
  ON users.id = disciplines_for_performance.user_id
  WHERE users.instrument = %{instrument} AND users.part = %{part} AND NOT users.buck_id = '%{buck_id}'
) users_disciplines ON s.id = users_disciplines.spot_id
LEFT OUTER JOIN user_challenges AS uc ON c.id = uc.challenge_id
WHERE s.file < 13
GROUP BY
  c.id,
  s.row,
  s.file,
  c.challenge_type,
  users_disciplines.first_name,
  users_disciplines.last_name,
  users_disciplines.open_spot,
  users_disciplines.buck_id
;
