DROP FUNCTION IF EXISTS can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256));
CREATE OR REPLACE FUNCTION can_user_eval(userNameNumber varchar(256), resultId int)
RETURNS boolean as $$
DECLARE
  nameNumberOne varchar(256);
  nameNumberTwo varchar(256);
  resultInstrument instrument;
  resultRow varchar(1);
  rowOne varchar(1);
  rowTwo varchar(1);
  userRole varchar(256);
  userInstrument instrument;
  userRow varchar(1);
BEGIN

  SELECT role, instrument, substring(spot_id, 1, 1)
  INTO userRole, userInstrument, userRow
  FROM users
  WHERE name_number = userNameNumber;

  SELECT u.instrument, substring(r.spot_id, 1, 1), r.first_name_number, r.second_name_number
  INTO resultInstrument, resultRow, nameNumberOne, nameNumberTwo
  FROM users AS u, results AS r
  WHERE r.id = resultId AND u.name_number = r.first_name_number;

  IF userRole = 'Admin' OR userRole = 'Director' THEN
    IF userInstrument = 'Any' OR userInstrument = resultInstrument THEN
      RETURN true;
    ELSE
      RETURN false;
    END IF;
  ELSIF userRole = 'Squad Leader' THEN
    -- Squad Leaders can see challenges that are either into their row, or results involving someone in their row
    SELECT substring(spot_id, 1, 1) INTO rowOne FROM users WHERE name_number = nameNumberOne;
    SELECT substring(spot_id, 1, 1) INTO rowTwo FROM users WHERE name_number = nameNumberTwo;

    RETURN userRow = rowOne OR userRow = rowTwo OR userRow = resultRow;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;
