SELECT t1.name AS name_one, t2.name AS name_two, t1.spot_id AS spot_id, t1.id, t1.name_number AS first_name_number,
       t2.name_number AS second_name_number, t1.comments AS first_comments, t2.comments AS second_comments, t1.winner_id,
       t1.alternate AS user_one_alternate, t2.alternate AS user_two_alternate
FROM
  (SELECT u1.name, r1.id, r1.spot_id, u1.name_number, r1.first_comments AS comments, r1.winner_id, r1.pending, substring(u1.spot_id, 2)::integer > 12 AS alternate
   FROM results AS r1, users AS u1
   WHERE r1.first_name_number = u1.name_number AND r1.performance_id = $1) t1
LEFT JOIN
  (SELECT u2.name, r2.id, u2.name_number, r2.second_comments AS comments, substring(u2.spot_id, 2)::integer > 12 AS alternate
   FROM results AS r2, users AS u2
   WHERE r2.second_name_number = u2.name_number) t2
ON
  t1.id = t2.id;
