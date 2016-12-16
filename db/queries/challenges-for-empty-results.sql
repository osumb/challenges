SELECT t1.name AS challenger, t2.name AS challengee, t1.open AS spot_open, t1.challenger_spot AS challenger_spot,
t1.challengee_spot AS challengee_spot, t1.name_number AS first_name_number, t2.name_number AS second_name_number, t1.performance_id
FROM
  (
    SELECT u1.name, c.spot_id AS challengee_spot, u1.spot_id AS challenger_spot, s.open, u1.name_number, c.performance_id
    FROM challenges AS c, spots AS s, users AS u1
    WHERE c.spot_id = s.id AND u1.name_number = c.user_name_number AND c.performance_id = $1
  ) t1
LEFT JOIN
  (
    SELECT u2.name, u2.spot_id, u2.name_number
    FROM users AS u2
  ) t2
ON
  t1.challengee_spot = t2.spot_id
WHERE NOT EXISTS (SELECT * FROM results AS r WHERE r.performance_id = t1.performance_id AND r.spot_id = t2.spot_id)
ORDER BY (substring(t1.challenger_spot, 0, 2), substring(t1.challenger_spot, 2)::int)
