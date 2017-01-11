-- A user can make a challenge only if
SELECT count(*) > 0 AS can_challenge FROM users WHERE
-- They haven't made a challenge yet AND
NOT EXISTS (SELECT * FROM challenges WHERE user_name_number = $1 AND performance_id = $2) AND
(
  -- The user is an alternate and hasn't had their spot 'Closed' (made ineligible)
  (
    SELECT count(*) > 0 FROM users
    WHERE name_number = $1 and substring(spot_id, 2)::integer > 12 AND
    (
      NOT EXISTS (
        SELECT * FROM manage AS m
        WHERE m.user_name_number = $1 AND m.performance_id = $2 AND NOT m.voluntary
        ORDER BY id DESC LIMIT 1
      ) OR
      (
        SELECT reason = 'Closed Spot' OR voluntary FROM manage AS m
        WHERE m.user_name_number = $1 AND m.performance_id = $2
        ORDER BY id DESC LIMIT 1
      )
    )
  )
  OR
  -- The user isn't an alternate and they have a voluntary manage action made for them (opened spot on purpose)
  (
    SELECT count(*) > 0 FROM users WHERE name_number = $1 and substring(spot_id, 2)::integer <= 12 AND
    (
      SELECT COALESCE(voluntary, true) FROM manage AS m
      WHERE m.user_name_number = $1 AND m.performance_id = $2
      ORDER BY id DESC LIMIT 1
    )
  )
)
