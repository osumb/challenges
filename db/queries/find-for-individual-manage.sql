SELECT
  user_spot.name AS name,
  user_spot.name_number AS name_number,
  user_spot.spot_id AS spot_id,
  user_spot.spot_open,
  manage_performance.reason,
  manage_performance.voluntary,
  manage_performance.performance_id,
  manage_performance.performance_name
FROM (
  SELECT name, name_number, open AS spot_open, id AS spot_id
  FROM users
  JOIN spots ON users.spot_id = spots.id
  WHERE users.name_number = $1
) user_spot
LEFT JOIN (
  SELECT m.id AS manage_id, m.user_name_number, m.reason, m.voluntary, p.id AS performance_id, p.name AS performance_name
  FROM performances AS p
  JOIN manage AS m ON p.id = m.performance_id
) manage_performance
ON user_spot.name_number = manage_performance.user_name_number
ORDER BY manage_performance.manage_id DESC;
