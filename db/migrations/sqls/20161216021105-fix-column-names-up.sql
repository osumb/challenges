ALTER TABLE challenges RENAME performanceid to performance_id;
ALTER TABLE challenges RENAME usernamenumber to user_name_number;
ALTER TABLE challenges RENAME spotid to spot_id;
ALTER TABLE manage RENAME performanceid to performance_id;
ALTER TABLE manage RENAME usernamenumber to user_name_number;
ALTER TABLE manage RENAME spotid to spot_id;
ALTER TABLE performances RENAME performdate to perform_date;
ALTER TABLE performances RENAME openat to open_at;
ALTER TABLE performances RENAME closeat to close_at;
ALTER TABLE results RENAME performanceid to performance_id;
ALTER TABLE results RENAME spotid to spot_id;
ALTER TABLE results RENAME firstnamenumber to first_name_number;
ALTER TABLE results RENAME secondnamenumber to second_name_number;
ALTER TABLE results RENAME firstcomments to first_comments;
ALTER TABLE results RENAME secondcomments to second_comments;
ALTER TABLE results RENAME winnerid to winner_id;
ALTER TABLE results RENAME needsapproval to needs_approval;
ALTER TABLE users RENAME namenumber to name_number;
ALTER TABLE users RENAME spotid to spot_id;
ALTER TABLE spots RENAME challengedcount to challenged_count;

DROP TABLE results_approve;

DROP FUNCTION IF EXISTS switch_spots_based_on_results_one_user(resultIds int[]);
CREATE OR REPLACE FUNCTION switch_spots_based_on_results_one_user(resultIds int[])
RETURNS VOID AS $$
DECLARE userOne varchar(256); userTwo varchar(256); spotOne char(3); winnerSpot char(3); rId int;
BEGIN
  FOREACH rId IN ARRAY resultIds
  LOOP
    SELECT first_name_number, spot_id
    INTO userOne, winnerSpot
    FROM results
    WHERE results.id = rId;

    SELECT name_number INTO userTwo FROM users WHERE spot_id = winnerSpot;
    SELECT spot_id INTO spotOne FROM users WHERE name_number = userOne;
    UPDATE users SET spot_id = winnerSpot WHERE name_number = userOne;
    UPDATE users SET spot_id = spotOne WHERE name_number = userTwo;
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
    SELECT first_name_number, second_name_number, winner_id, spot_id
    INTO userOne, userTwo, winner, winnerSpot
    FROM results
    WHERE results.id = rId;

    SELECT spot_id INTO spotOne FROM users WHERE name_number = userOne;
    SELECT spot_id INTO spotTwo FROM users WHERE name_number = userTwo;

    userOneAlternate = substring(spotOne, 2)::integer > 12;
    userTwoAlternate = substring(spotTwo, 2)::integer > 12;

    -- If it's an alternate vs regular for a non open spot, easy peasy :D
    IF (userOneAlternate AND NOT userTwoAlternate) OR
       (NOT userOneAlternate AND userTwoAlternate)
    THEN
      -- If the userOne won, but wasn't already in the spot won
      IF userOne = winner AND spotOne <> winnerSpot THEN
        UPDATE users SET spot_id = winnerSpot WHERE name_number = userOne;
        UPDATE users SET spot_id = spotOne WHERE name_number = userTwo;
      ELSIF winner = userTwo AND spotTwo <> winnerSpot THEN
        UPDATE users SET spot_id = winnerSpot WHERE name_number = userTwo;
        UPDATE users SET spot_id = spotTwo WHERE name_number = userOne;
      END IF;
    END IF;

    -- If two alternates were involved in the challenge
    IF (userOneAlternate AND userTwoAlternate) THEN
      IF userOne = winner THEN
        -- The person who originally had the open spot gets the winner's old spot
        UPDATE users SET spot_id = spotOne WHERE spot_id = winnerSpot;
        UPDATE users SET spot_id = winnerSpot WHERE name_number = userOne;
      ELSE
        -- The person who originally had the open spot gets the winner's old spot
        UPDATE users SET spot_id = spotTwo WHERE spot_id = winnerSpot;
        UPDATE users SET spot_id = winnerSpot WHERE name_number = userTwo;
      END IF;
    END IF;

    -- If two regulars were involved in the challenge
    IF (NOT userOneAlternate AND NOT userTwoAlternate) THEN
      IF userOne = winner AND spotOne <> winnerSpot THEN
        UPDATE users SET spot_id = winnerSpot WHERE name_number = userOne;
        UPDATE users SET spot_id = spotOne WHERE name_number = userTwo;
      ELSIF userTwo = winner AND spotTwo <> winnerSpot THEN
        UPDATE users SET spot_id = winnerSpot WHERE name_number = userTwo;
        UPDATE users SET spot_id = spotTwo WHERE name_number = userOne;
      END IF;
    END IF;

  END LOOP;

  -- Set all things back to normal
  UPDATE spots SET challenged_count = 0, open = FALSE;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256));
CREATE OR REPLACE FUNCTION can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256))
RETURNS boolean as $$
DECLARE rowOne varchar(1); rowTwo varchar(1);
BEGIN

  -- Squad Leaders can see challenges that are either into their row, or results involving someone in their row
  SELECT substring(spot_id, 1, 1) INTO rowOne FROM users WHERE name_number = nameNumberOne;
  SELECT substring(spot_id, 1, 1) INTO rowTwo FROM users WHERE name_number = nameNumberTwo;

  RETURN sLRow = rowOne OR sLRow = rowTwo OR sLRow = resultRow;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS make_challenge(uId varchar(256), pId int, sId varchar(3));
CREATE OR REPLACE FUNCTION make_challenge(uId varchar(256), pId int, sId varchar(3))
RETURNS int as $$
DECLARE spotOpen boolean; cCount int;
BEGIN
  -- If the user has already made a challenge
  IF EXISTS (SELECT * FROM challenges WHERE user_name_number = uId AND performance_id = pId) THEN
    RETURN 2;
  END IF;
  SELECT spots.open, spots.challenged_count INTO spotOpen, cCount FROM spots WHERE id = sId;
  -- If the spot has been fully challenged
  IF ((spotOpen AND cCount >= 2) OR (NOT spotOpen AND cCount >= 1)) THEN
    RETURN 1;
  END IF;
  INSERT INTO challenges (user_name_number, performance_id, spot_id) VALUES (uId, pId, sId);
  UPDATE spots SET challenged_count = challenged_count + 1 WHERE id = sId;

  RETURN 0;
END;
$$ LANGUAGE plpgsql;
