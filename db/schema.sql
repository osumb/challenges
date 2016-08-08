----------------------------------------
-- CLEAN UP
----------------------------------------

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS spots CASCADE;
DROP TABLE IF EXISTS performances CASCADE;
DROP TYPE IF EXISTS part;
DROP TYPE IF EXISTS instrument;
DROP TYPE IF EXISTS role;

----------------------------------------
-- FUNCTIONS
----------------------------------------
DROP FUNCTION IF EXISTS forfeit_spot(userNameNumber varchar(256));
CREATE OR REPLACE FUNCTION forfeit_spot(userNameNumber varchar(256))
RETURNS void AS $$
DECLARE sId char(3);
BEGIN
  SELECT spotId INTO sId FROM users WHERE nameNumber = userNameNumber;
  UPDATE spots SET open = TRUE WHERE id = sId;
  UPDATE users SET eligible = TRUE WHERE nameNumber = userNameNumber;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS flag_current_performance();
CREATE OR REPLACE FUNCTION flag_current_performance()
RETURNS void AS $$
DECLARE performanceId int;
BEGIN
  SELECT id INTO performanceId FROM performances WHERE now() at time zone 'utc' < closeAt ORDER BY openAt ASC LIMIT 1;
  UPDATE performances SET current = FALSE WHERE id <> performanceId;
  UPDATE performances SET current = TRUE WHERE id = performanceId;
END;
$$ LANGUAGE plpgsql;

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

    SELECT spotId, alternate INTO spotOne, userOneAlternate FROM users WHERE nameNumber = userOne;
    SELECT spotId, alternate INTO spotTwo, userTwoAlternate FROM users WHERE nameNumber = userTwo;

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
        -- The person who originally had the open spot gets the loser's spot
        UPDATE users SET spotId = spotTwo WHERE spotId = winnerSpot;
        UPDATE users SET spotId = winnerSpot WHERE nameNumber = userOne;
      ELSE
        -- The person who originally had the open spot gets the loser's spot
        UPDATE users SET spotId = spotOne WHERE spotId = winnerSpot;
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
  UPDATE users SET eligible = TRUE WHERE alternate;
  UPDATE users SET eligible = FALSE WHERE NOT alternate;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS can_sl_eval(instrumentA varchar(256), instrumentB varchar(256), partA varchar(256), partB varchar(256));
CREATE OR REPLACE FUNCTION can_sl_eval(instrumentA varchar(256), instrumentB varchar(256), partA varchar(256), partB varchar(256))
RETURNS boolean as $$
BEGIN

  -- We'll probably have to do some fancier things here for trumpet challenge evals
  IF (instrumentA = 'Trumpet') THEN
    RETURN instrumentA = instrumentB AND partA = partB;
  END IF;

  RETURN instrumentA = instrumentB;
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
  UPDATE users SET eligible = FALSE WHERE nameNumber = uId;

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
  IF id = idOne THEN
    id := idOne;
  ELSE
    id := idTwo;
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
  'First', 'Second', 'Solo', 'Efer', 'Flugel', 'Bass'
);

----------------------------------------
-- INSTRUMENTS
----------------------------------------
CREATE TYPE instrument AS ENUM (
  'Trumpet', 'Mellophone', 'Trombone', 'Baritone', 'Snare', 'Tenor', 'Cymbals', 'Bass', 'Sousaphone'
);

----------------------------------------
-- ROLES
----------------------------------------
CREATE TYPE role AS ENUM (
  'Member', 'Admin', 'Director', 'StudentStaff', 'SquadLeader'
);

----------------------------------------
-- Spots
----------------------------------------
CREATE TABLE spots (
  id varchar(3) PRIMARY KEY,
  open boolean DEFAULT FALSE,
  challengedCount int DEFAULT 0,
  created_at timestamp NOT NULL,
  modified_at timestamp NOT NULL
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
  spotId varchar(3) references spots(id),
  name varchar(256) NOT NULL,
  password varchar(256) NOT NULL,
  instrument instrument,
  part part,
  eligible boolean NOT NULL DEFAULT FALSE,
  squadLeader boolean NOT NULL DEFAULT FALSE,
  admin boolean NOT NULL DEFAULT FALSE,
  alternate boolean NOT NULL DEFAULT FALSE,
  created_at timestamp NOT NULL,
  modified_at timestamp NOT NULL
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
  performDate timestamp NOT NULL,
  current boolean NOT NULL DEFAULT FALSE,
  openAt timestamp NOT NULL,
  closeAt timestamp NOT NULL,
  created_at timestamp NOT NULL,
  modified_at timestamp NOT NULL
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
  created_at timestamp NOT NULL,
  modified_at timestamp NOT NULL
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
  pending boolean NOT NULL DEFAULT false,
  needsApproval boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL,
  modified_at timestamp NOT NULL
);

CREATE TRIGGER results_created_stamp BEFORE INSERT ON results
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER results_modified_stamp BEFORE INSERT ON results
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();
