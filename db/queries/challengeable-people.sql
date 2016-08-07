SELECT u.name, u.namenumber, s.id AS spotid, s.challengedcount, s.open
FROM spots AS s
JOIN users AS u ON s.id = u.spotId
WHERE u.instrument = $1 AND u.part = $2 AND substring(u.spotId, 2)::integer <= 12
ORDER BY (substring(s.id, 0, 2), substring(s.id, 2)::int);
