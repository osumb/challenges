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
RETURNS text as $$
DECLARE message TEXT; spotOpen boolean; cCount int;
BEGIN
  IF EXISTS (SELECT * FROM challenges WHERE userNameNumber = uId AND performanceId = pId) THEN
    message := 'Challenge already made';
    RETURN message;
  END IF;
  SELECT spots.open, spots.challengedCount INTO spotOpen, cCount FROM spots WHERE id = sId;
  IF ((spotOpen AND cCount >= 2) OR (NOT spotOpen AND cCount >= 1)) THEN
    message := 'Spot already challenged';
    RETURN message;
  END IF;
  INSERT INTO challenges (userNameNumber, performanceId, spotId) VALUES (uId, pId, sId);
  UPDATE spots SET challengedCount = challengedCount + 1 WHERE id = sId;
  UPDATE users SET eligible = FALSE WHERE nameNumber = uId;
  -- If the spot is fully challenged, we're going to add to the results table
  -- There are two ways we could grab the other user. If they're also challenging the spot
  -- or if the spot isn't open, we need the current user associated with the spot
  IF (spotOpen AND cCount + 1 = 2) THEN
    INSERT INTO results (performanceId, spotId, firstNameNumber, secondNameNumber, pending)
    VALUES (pId, sId, (SELECT userNameNumber FROM challenges WHERE performanceId = pId AND spotId = sId), uId, TRUE);
  ELSIF (NOT spotOpen AND cCount + 1 = 1) THEN
    INSERT INTO results (performanceId, spotId, firstNameNumber, secondNameNumber, pending, needsApproval)
    VALUES (pId, sId, uId, (SELECT nameNumber FROM users WHERE spotId = sId), TRUE, FALSE);
  END IF;
	message:= '';

	RETURN message;
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
	secondNameNumber varchar(256) references users(nameNumber) NOT NULL,
  firstComments text NOT NULL DEFAULT '',
	secondComments text NOT NULL DEFAULT '',
	winnerId varchar(256) references users(nameNumber),
	pending boolean NOT NULL DEFAULT false,
  needsApproval boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL,
  modified_at timestamp NOT NULL
);

CREATE TRIGGER results_created_stamp BEFORE INSERT ON results
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER results_modified_stamp BEFORE INSERT ON results
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();
