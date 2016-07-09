SELECT t1.name AS nameOne, t2.name AS nameTwo, t1.spotId AS spotId, t1.id AS resultId, t1.nameNumber AS nameNumberOne,
       t2.nameNumber AS nameNumberTwo, t1.comments AS firstComments, t2.comments AS secondComments, t1.winnerId,
       t1.performanceId, t1.performanceName
FROM
  (
    SELECT u1.name, r1.id, r1.spotId, u1.nameNumber, r1.firstComments AS comments, r1.winnerId, r1.pending,
    p.id AS performanceId, p.name AS performanceName
    FROM results AS r1, users AS u1, performances AS p
    WHERE r1.firstNameNumber = u1.nameNumber AND r1.needsApproval AND r1.performanceId = p.id AND NOT r1.pending
    ORDER BY p.id
  ) t1
LEFT JOIN
  (
    SELECT u2.name, r2.id, u2.nameNumber, r2.secondComments AS comments
    FROM results AS r2, users AS u2
    WHERE r2.secondNameNumber = u2.nameNumber
  ) t2
ON
  t1.id = t2.id;
