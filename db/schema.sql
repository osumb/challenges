----------------------------------------
-- CLEAN UP
----------------------------------------

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS spots CASCADE;
DROP TABLE IF EXISTS performances CASCADE;
DROP TABLE IF EXISTS manage CASCADE;
DROP TABLE IF EXISTS results_approve CASCADE;
DROP TYPE IF EXISTS part;
DROP TYPE IF EXISTS instrument;
DROP TYPE IF EXISTS role;
CREATE EXTENSION IF NOT EXISTS citext;

----------------------------------------
-- FUNCTIONS
----------------------------------------
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


CREATE OR REPLACE FUNCTION get_user_result_comments(idOne varchar(256), commentsOne text, commentsTwo text, id varchar(256))
RETURNS text AS $$
DECLARE comments text;
BEGIN
  IF id = idOne THEN
    comments := commentsOne;
  ELSE
    comments := commentsTwo;
  END IF;

  RETURN comments;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_other_user_id(idCompare varchar(256), idOne varchar(256), idTwo varchar(256))
RETURNS varchar(256) AS $$
DECLARE id varchar(256);
BEGIN
  IF idCompare = idOne THEN
    id := idTwo;
  ELSE
    id := idOne;
  END IF;

  RETURN id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION created_stamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION modified_stamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----------------------------------------
-- PARTS
----------------------------------------
CREATE TYPE part AS ENUM (
  'Any', 'Bass', 'Cymbals', 'Efer', 'First', 'Flugel', 'Second', 'Snare', 'Solo', 'Tenor'
);

----------------------------------------
-- INSTRUMENTS
----------------------------------------
CREATE TYPE instrument AS ENUM (
  'Any', 'Baritone', 'Mellophone', 'Percussion', 'Sousaphone', 'Trombone', 'Trumpet'
);

----------------------------------------
-- ROLES
----------------------------------------
CREATE TYPE role AS ENUM (
  'Admin', 'Director', 'Member', 'Squad Leader'
);

----------------------------------------
-- Spots
----------------------------------------
CREATE TABLE spots (
  id varchar(3) PRIMARY KEY,
  open boolean DEFAULT FALSE,
  challengedCount int DEFAULT 0,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER spots_created_stamp BEFORE INSERT ON spots
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER spots_modified_stamp BEFORE INSERT ON spots
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

----------------------------------------
-- USERS
----------------------------------------
CREATE TABLE users (
  nameNumber varchar(256) PRIMARY KEY,
  email citext NOT NULL,
  instrument instrument,
  name varchar(256) NOT NULL,
  new boolean NOT NULL DEFAULT TRUE,
  part part,
  password varchar(256) NOT NULL,
  role role,
  spotId varchar(3) references spots(id),
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER users_created_stamp BEFORE INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER users_modified_stamp BEFORE INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

----------------------------------------
-- PERFORMANCES
----------------------------------------
CREATE TABLE performances (
  id serial PRIMARY KEY,
  name varchar(256) NOT NULL,
  performDate timestamptz NOT NULL,
  openAt timestamptz NOT NULL,
  closeAt timestamptz NOT NULL,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER performances_created_stamp BEFORE INSERT ON performances
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER performances_modified_stamp BEFORE INSERT ON performances
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

----------------------------------------
-- CHALLENGES
----------------------------------------
CREATE TABLE challenges (
  id serial PRIMARY KEY,
  performanceId integer references performances(id) NOT NULL,
  userNameNumber varchar(256) references users(nameNumber) NOT NULL,
  spotId varchar(3) references spots(id) NOT NULL,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER challenges_created_stamp BEFORE INSERT ON challenges
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER challenges_modified_stamp BEFORE INSERT ON challenges
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

----------------------------------------
-- RESULTS
----------------------------------------
CREATE TABLE results (
  id serial PRIMARY KEY,
  performanceId integer references performances(id) NOT NULL,
  spotId varchar(3) references spots(id) NOT NULL,
  firstNameNumber varchar(256) references users(nameNumber) NOT NULL,
  secondNameNumber varchar(256) references users(nameNumber),
  firstComments text NOT NULL DEFAULT '',
  secondComments text NOT NULL DEFAULT '',
  winnerId varchar(256) references users(nameNumber),
  pending boolean NOT NULL DEFAULT true,
  needsApproval boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER results_created_stamp BEFORE INSERT ON results
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER results_modified_stamp BEFORE INSERT ON results
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

----------------------------------------
-- MANAGE
----------------------------------------
CREATE TABLE manage (
  id serial PRIMARY KEY,
  performanceId integer references performances(id) NOT NULL,
  userNameNumber varchar(256) references users(nameNumber) NOT NULL,
  reason text NOT NULL DEFAULT '',
  spotId varchar(3) references spots(id) NOT NULL,
  voluntary boolean NOT NULL default true,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER manage_created_stamp BEFORE INSERT ON manage
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER manage_modified_stamp BEFORE INSERT ON manage
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();

----------------------------------------
-- ResultsApprovePermission
----------------------------------------
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

CREATE TRIGGER results_approve_modified_stamp BEFORE INSERT ON results_approve
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();
