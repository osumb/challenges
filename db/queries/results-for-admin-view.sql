SELECT
  user1.name AS first_name,
  user2.name AS second_name,
  user1.spot_id AS spot_id,
  user1.id AS result_id,
  user1.name_number AS first_name_number,
  user2.name_number AS second_name_number,
  user1.comments AS first_comments,
  user2.comments AS second_comments,
  user1.winner_id,
  user1.performance_id,
  user1.performance_name
FROM (
  SELECT
    u1.name,
    r1.id,
    r1.spot_id,
    u1.name_number,
    r1.first_comments AS comments,
    r1.winner_id, p.id AS performance_id,
    p.name AS performance_name,
    u1.instrument AS instrument,
    u1.part AS part
  FROM performances AS p, results AS r1, users AS u1
  WHERE r1.first_name_number = u1.name_number AND r1.performance_id = p.id AND NOT r1.needs_approval AND NOT r1.pending
) user1
LEFT OUTER JOIN (
  SELECT u2.name, r2.id, u2.name_number, r2.second_comments AS comments
  FROM results AS r2, users AS u2
  WHERE r2.second_name_number = u2.name_number
) user2
ON user1.id = user2.id
WHERE user1.name_number = $1 OR user2.name_number = $1
ORDER BY user1.performance_id, substring(user1.spot_id, 1, 1), substring(user1.spot_id, 2, 2)::int;
