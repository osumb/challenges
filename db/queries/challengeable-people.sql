SELECT u.name, u.name_number, s.id AS spot_id, s.challenged_count, s.open AS spot_open
FROM spots AS s
JOIN users AS u ON s.id = u.spot_id
WHERE
  u.instrument = $1 AND
  u.part = $2 AND
  s.id != $3 AND
  substring(u.spot_id, 2)::integer <= 12 AND
  (
    ((NOT EXISTS (SELECT * FROM challenges WHERE user_name_number = $4 AND performance_id = $5))) AND
    (
      (SELECT voluntary FROM manage AS m WHERE m.user_name_number = $4 AND m.performance_id = $5 ORDER BY id DESC LIMIT 1) OR
      (
        SELECT substring($3, 2)::integer > 12 AND
        (
          NOT EXISTS (SELECT * FROM manage AS m WHERE m.user_name_number = $4 AND m.performance_id = $5 ORDER BY id DESC LIMIT 1) OR
          (SELECT reason = 'Closed Spot' FROM manage AS m WHERE m.user_name_number = $4 AND m.performance_id = $5 ORDER BY id DESC LIMIT 1)
        )
      )
    )
  )
ORDER BY (substring(s.id, 0, 2), substring(s.id, 2)::int);
