SELECT t1.name AS nameOne, t2.name AS nameTwo, t1.spotId AS spotId, t1.id, t1.nameNumber AS firstNameNumber,
       t2.nameNumber AS secondNameNumber, t1.comments AS firstComments, t2.comments AS secondComments, t1.winnerId,
       t1.alternate AS userOneAlternate, t2.alternate AS userTwoAlternate
FROM
  (SELECT u1.name, r1.id, r1.spotId, u1.nameNumber, r1.firstComments AS comments, r1.winnerId, r1.pending, substring(u1.spotid, 2)::integer > 12 AS alternate
   FROM results AS r1, users AS u1
   WHERE r1.firstNameNumber = u1.nameNumber AND r1.performanceId = $1) t1
LEFT JOIN
  (SELECT u2.name, r2.id, u2.nameNumber, r2.secondComments AS comments, substring(u2.spotid, 2)::integer > 12 AS alternate
   FROM results AS r2, users AS u2
   WHERE r2.secondNameNumber = u2.nameNumber) t2
ON
  t1.id = t2.id;
