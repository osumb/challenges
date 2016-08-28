SELECT t1.name AS nameOne, t2.name AS nameTwo, t1.spotId AS spotId, t1.id AS resultId, t1.nameNumber AS firstNameNumber,
       t2.nameNumber AS secondNameNumber
FROM
  (
    SELECT u1.name, r1.id, r1.spotId, u1.nameNumber, r1.performanceId
    FROM results AS r1, users AS u1
    WHERE r1.firstNameNumber = u1.nameNumber AND NOT
    r1.needsApproval AND
    u1.nameNumber != $1 AND
    r1.pending
  ) t1
LEFT JOIN
  (
    SELECT u2.name, r2.id, u2.nameNumber
    FROM results AS r2, users AS u2
    WHERE r2.secondNameNumber = u2.nameNumber
  ) t2
ON
  t1.id = t2.id
JOIN performances AS p ON t1.performanceid = p.id
WHERE p.closeAt < now() AND can_sl_eval($2, substring(t1.spotId, 1, 1), t1.nameNumber, t2.nameNumber);
