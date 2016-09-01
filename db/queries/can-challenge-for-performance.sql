SELECT * FROM users WHERE
NOT EXISTS (SELECT * FROM challenges WHERE userNamenumber = $1 AND performanceid = $2) AND
((SELECT COALESCE(voluntary, true) FROM manage AS m WHERE m.usernamenumber = $1 AND m.performanceid = $2 ORDER BY id DESC LIMIT 1) OR
(
  SELECT substring($3, 2)::integer > 12 AND
  (
    NOT EXISTS (SELECT * FROM manage AS m WHERE m.usernamenumber = $1 AND m.performanceid = $2 ORDER BY id DESC LIMIT 1) OR
    (SELECT reason = 'Closed Spot' FROM manage AS m WHERE m.usernamenumber = $1 AND m.performanceid = $2 ORDER BY id DESC LIMIT 1)
  )
) AND nameNumber = $1);
