DROP FUNCTION can_user_eval(userNameNumber varchar(256), resultId int);
CREATE FUNCTION can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256))
RETURNS boolean as $$
DECLARE rowOne varchar(1); rowTwo varchar(1);
BEGIN

  -- Squad Leaders can see challenges that are either into their row, or results involving someone in their row
  SELECT substring(spot_id, 1, 1) INTO rowOne FROM users WHERE name_number = nameNumberOne;
  SELECT substring(spot_id, 1, 1) INTO rowTwo FROM users WHERE name_number = nameNumberTwo;

  RETURN sLRow = rowOne OR sLRow = rowTwo OR sLRow = resultRow;
END;
$$ LANGUAGE plpgsql;
