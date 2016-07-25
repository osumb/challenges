SELECT t1.name AS challenger, t2.name AS challengee, t1.open AS spotopen, t1.challengerspot AS challengerspot,
t1.challengeespot AS challengeespot, t1.namenumber AS namenumberone, t2.namenumber AS namenumbertwo
FROM
  (
    SELECT u1.name, c.spotId AS challengeespot, u1.spotId AS challengerspot, s.open, u1.namenumber
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
ORDER BY t1.challengerspot;
