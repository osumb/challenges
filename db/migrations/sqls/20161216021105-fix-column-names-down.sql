ALTER TABLE challenges RENAME performance_id to performanceid;
ALTER TABLE challenges RENAME user_name_number to usernamenumber;
ALTER TABLE challenges RENAME spot_id to spotid;
ALTER TABLE manage RENAME performance_id to performanceid;
ALTER TABLE manage RENAME user_name_number to usernamenumber;
ALTER TABLE manage RENAME spot_id to spotid;
ALTER TABLE performances RENAME perform_date to performdate;
ALTER TABLE performances RENAME open_at to openat;
ALTER TABLE performances RENAME close_at to closeat;
ALTER TABLE results RENAME performance_id to performanceid;
ALTER TABLE results RENAME spot_id to spotid;
ALTER TABLE results RENAME first_name_number to firstnamenumber;
ALTER TABLE results RENAME second_name_number to secondnamenumber;
ALTER TABLE results RENAME first_comments to firstcomments;
ALTER TABLE results RENAME second_comments to secondcomments;
ALTER TABLE results RENAME winner_id to winnerid;
ALTER TABLE results RENAME needs_approval to needsapproval;
ALTER TABLE users RENAME name_number to namenumber;
ALTER TABLE users RENAME spot_id to spotid;
ALTER TABLE spots RENAME challenged_count to challengedcount;

CREATE TABLE results_approve (
  id serial PRIMARY KEY,
  userNameNumber varchar(256) references users(nameNumber) NOT NULL,
  instrument instrument,
  part part,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER results_approve_created_stamp BEFORE INSERT ON results_approve
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER results_approve_modified_stamp BEFORE INSERT OR UPDATE ON results_approve
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

DROP FUNCTION IF EXISTS switch_spots_based_on_results_one_user(resultIds int[]);
CREATE OR REPLACE FUNCTION switch_spots_based_on_results_one_user(resultIds int[])
RETURNS VOID AS $$
DECLARE userOne varchar(256); userTwo varchar(256); spotOne char(3); winnerSpot char(3); rId int;
BEGIN
  FOREACH rId IN ARRAY resultIds
  LOOP
    SELECT firstNameNumber, spotId
    INTO userOne, winnerSpot
    FROM results
    WHERE results.id = rId;

    SELECT namenumber INTO userTwo FROM users WHERE spotId = winnerSpot;
    SELECT spotId INTO spotOne FROM users WHERE namenumber = userOne;
    UPDATE users SET spotId = winnerSpot WHERE namenumber = userOne;
    UPDATE users SET spotId = spotOne WHERE namenumber = userTwo;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

/*
  This function assumes that the array of resultIds has been sorted in a special order
    - Regular vs Alternate
    - Alternate vs Alternate
    - Regular vs Regular
  We're not going to worry about results where only one person is involved
*/
DROP FUNCTION IF EXISTS switch_spots_based_on_results(resultIds int[]);
CREATE OR REPLACE FUNCTION switch_spots_based_on_results(resultIds int[])
RETURNS VOID AS $$
DECLARE userOne varchar(256); userTwo varchar(256); winner varchar(256); spotOne char(3); spotTwo char(3);
winnerSpot char(3); rId int; userOneAlternate boolean; userTwoAlternate boolean;
BEGIN

  FOREACH rId IN ARRAY resultIds
  LOOP
    SELECT firstNameNumber, secondNameNumber, winnerId, spotId
    INTO userOne, userTwo, winner, winnerSpot
    FROM results
    WHERE results.id = rId;

    SELECT spotId INTO spotOne FROM users WHERE nameNumber = userOne;
    SELECT spotId INTO spotTwo FROM users WHERE nameNumber = userTwo;

    userOneAlternate = substring(spotOne, 2)::integer > 12;
    userTwoAlternate = substring(spotTwo, 2)::integer > 12;

    -- If it's an alternate vs regular for a non open spot, easy peasy :D
    IF (userOneAlternate AND NOT userTwoAlternate) OR
       (NOT userOneAlternate AND userTwoAlternate)
    THEN
      -- If the userOne won, but wasn't already in the spot won
      IF userOne = winner AND spotOne <> winnerSpot THEN
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userOne;
        UPDATE users SET spotId = spotOne WHERE nameNumber = userTwo;
      ELSIF winner = userTwo AND spotTwo <> winnerSpot THEN
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userTwo;
        UPDATE users SET spotId = spotTwo WHERE nameNumber = userOne;
      END IF;
    END IF;

    -- If two alternates were involved in the challenge
    IF (userOneAlternate AND userTwoAlternate) THEN
      IF userOne = winner THEN
        -- The person who originally had the open spot gets the winner's old spot
        UPDATE users SET spotId = spotOne WHERE spotId = winnerSpot;
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userOne;
      ELSE
        -- The person who originally had the open spot gets the winner's old spot
        UPDATE users SET spotId = spotTwo WHERE spotId = winnerSpot;
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userTwo;
      END IF;
    END IF;

    -- If two regulars were involved in the challenge
    IF (NOT userOneAlternate AND NOT userTwoAlternate) THEN
      IF userOne = winner AND spotOne <> winnerSpot THEN
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userOne;
        UPDATE users SET spotId = spotOne WHERE nameNumber = userTwo;
      ELSIF userTwo = winner AND spotTwo <> winnerSpot THEN
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userTwo;
        UPDATE users SET spotId = spotTwo WHERE nameNumber = userOne;
      END IF;
    END IF;

  END LOOP;

  -- Set all things back to normal
  UPDATE spots SET challengedCount = 0, open = FALSE;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256));
CREATE OR REPLACE FUNCTION can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256))
RETURNS boolean as $$
DECLARE rowOne varchar(1); rowTwo varchar(1);
BEGIN

  -- Squad Leaders can see challenges that are either into their row, or results involving someone in their row
  SELECT substring(spotId, 1, 1) INTO rowOne FROM users WHERE nameNumber = nameNumberOne;
  SELECT substring(spotId, 1, 1) INTO rowTwo FROM users WHERE nameNumber = nameNumberTwo;

  RETURN sLRow = rowOne OR sLRow = rowTwo OR sLRow = resultRow;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS make_challenge(uId varchar(256), pId int, sId varchar(3));
CREATE OR REPLACE FUNCTION make_challenge(uId varchar(256), pId int, sId varchar(3))
RETURNS int as $$
DECLARE spotOpen boolean; cCount int;
BEGIN
  -- If the user has already made a challenge
  IF EXISTS (SELECT * FROM challenges WHERE userNameNumber = uId AND performanceId = pId) THEN
    RETURN 2;
  END IF;
  SELECT spots.open, spots.challengedCount INTO spotOpen, cCount FROM spots WHERE id = sId;
  -- If the spot has been fully challenged
  IF ((spotOpen AND cCount >= 2) OR (NOT spotOpen AND cCount >= 1)) THEN
    RETURN 1;
  END IF;
  INSERT INTO challenges (userNameNumber, performanceId, spotId) VALUES (uId, pId, sId);
  UPDATE spots SET challengedCount = challengedCount + 1 WHERE id = sId;

  RETURN 0;
END;
$$ LANGUAGE plpgsql;
