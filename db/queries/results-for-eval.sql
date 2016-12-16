SELECT t1.name AS name_one, t2.name AS name_two, t1.spot_id AS spot_id, t1.id AS result_id, t1.name_number AS first_name_number,
       t2.name_number AS second_name_number
FROM
  (
    SELECT u1.name, r1.id, r1.spot_id, u1.name_number, r1.performance_id
    FROM results AS r1, users AS u1
    WHERE r1.first_name_number = u1.name_number AND NOT
    r1.needs_approval AND
    r1.pending
  ) t1
LEFT JOIN
  (
    SELECT u2.name, r2.id, u2.name_number
    FROM results AS r2, users AS u2
    WHERE r2.second_name_number = u2.name_number
  ) t2
ON
  t1.id = t2.id
WHERE t1.name_number != $1 AND
  (t2.name_number is NULL OR t2.name_number != $1) AND
  can_sl_eval($2, substring(t1.spot_id, 1, 1), t1.name_number, t2.name_number);
