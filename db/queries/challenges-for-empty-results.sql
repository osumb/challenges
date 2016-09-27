SELECT t1.name AS challenger, t2.name AS challengee, t1.open AS spotopen, t1.challengerspot AS challengerspot,
t1.challengeespot AS challengeespot, t1.namenumber AS firstnamenumber, t2.namenumber AS secondnamenumber, t1.performanceId
FROM
  (
    SELECT u1.name, c.spotId AS challengeespot, u1.spotId AS challengerspot, s.open, u1.namenumber, c.performanceId
    FROM challenges AS c, spots AS s, users AS u1
    WHERE c.spotId = s.id AND u1.namenumber = c.usernamenumber AND c.performanceId = $1
  ) t1
LEFT JOIN
  (
    SELECT u2.name, u2.spotId, u2.namenumber
    FROM users AS u2
  ) t2
ON
  t1.challengeespot = t2.spotId
WHERE NOT EXISTS (SELECT * FROM results AS r WHERE r.performanceId = t1.performanceId AND r.spotId = t2.spotId)
ORDER BY (substring(t1.challengerspot, 0, 2), substring(t1.challengerspot, 2)::int)
