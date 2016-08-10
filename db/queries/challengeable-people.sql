SELECT u.name, u.namenumber, s.id AS spotid, s.challengedcount, s.open
FROM spots AS s
JOIN users AS u ON s.id = u.spotId
WHERE
  u.instrument = $1 AND
  u.part = $2 AND
  s.id != $3 AND
  substring(u.spotId, 2)::integer <= 12 AND
  (
    -- The user is eligible to challenge if
    -- He/she hasn't made a challenge already
    -- He/she made a voluntary manage action OR
    -- He/she is an alternate AND there was no involuntary manage action
    (NOT EXISTS (SELECT * FROM challenges WHERE userNamenumber = $4 AND performanceid = $5)) AND
    (SELECT voluntary FROM manage AS m WHERE m.usernamenumber = $4 AND m.performanceid = $5 ORDER BY id DESC LIMIT 1) OR
    (
      SELECT substring($3, 2)::integer > 12 AND
      (
        NOT EXISTS (SELECT * FROM manage AS m WHERE m.usernamenumber = $4 AND m.performanceid = $5 ORDER BY id DESC LIMIT 1) OR
        (SELECT voluntary FROM manage AS m WHERE m.usernamenumber = $4 AND m.performanceid = $5 ORDER BY id DESC LIMIT 1)
      )
    )
  )
ORDER BY (substring(s.id, 0, 2), substring(s.id, 2)::int);
