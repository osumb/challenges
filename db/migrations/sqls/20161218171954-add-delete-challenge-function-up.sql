CREATE FUNCTION delete_challenge(challenge_id int)
RETURNS int as $$
DECLARE spotOpen boolean; cCount int;
BEGIN
  UPDATE spots
  SET challenged_count = challenged_count - 1
  WHERE id = (SELECT spot_id FROM challenges WHERE id = challenge_id);

  DELETE FROM challenges WHERE id = challenge_id;

  RETURN 0;
END;
$$ LANGUAGE plpgsql;
