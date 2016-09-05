SELECT
  user1.name AS nameone,
  user2.name AS nametwo,
  user1.spotid AS spotid,
  user1.id AS resultid,
  user1.namenumber AS firstnamenumber,
  user2.namenumber AS secondnamenumber,
  user1.comments AS firstcomments,
  user2.comments AS secondcomments,
  user1.winnerid,
  user1.performanceid,
  user1.performancename
FROM (
  SELECT
    u1.name,
    r1.id,
    r1.spotid,
    u1.namenumber,
    r1.firstcomments AS comments,
    r1.winnerid, p.id AS performanceid,
    p.name AS performancename,
    u1.instrument AS instrument,
    u1.part AS part
  FROM performances AS p, results AS r1, users AS u1
  WHERE r1.firstnamenumber = u1.namenumber AND r1.performanceid = p.id AND r1.needsapproval AND r1.pending
) user1
JOIN (
  SELECT u2.name, r2.id, u2.nameNumber, r2.secondComments AS comments
  FROM results AS r2, users AS u2
  WHERE r2.secondNameNumber = u2.nameNumber
) user2
ON user1.id = user2.id
WHERE (user1.instrument = $1 OR $1 = 'Any') AND (user1.part = $2 OR $2 = 'Any')
ORDER BY user1.performanceId;
