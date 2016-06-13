SELECT * FROM
  (SELECT R1.id, get_user_result_comments(R1.firstNameNumber, R1.firstComments, R1.secondComments, $1) AS comments, P.name, R1.winnerId, R1.spotId FROM Results AS R1, Performances AS P
  WHERE (R1.firstNameNumber = $1 OR R1.secondNameNumber = $1) AND
  R1.performanceId = P.id AND NOT R1.pending) t1
LEFT JOIN
  (SELECT U.name AS opponentName, R2.id
  FROM Users AS U, Results AS R2
  WHERE U.nameNumber = get_other_user_id($1, R2.firstNameNumber, R2.secondNameNumber)) t2
ON
  t1.id = t2.id;
