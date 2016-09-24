/* DROP TRIGGERS */
DROP TRIGGER IF EXISTS spots_created_stamp ON spots;
DROP TRIGGER IF EXISTS spots_modified_stamp ON spots;
DROP TRIGGER IF EXISTS users_created_stamp ON users;
DROP TRIGGER IF EXISTS users_modified_stamp ON users;
DROP TRIGGER IF EXISTS performances_created_stamp ON performances;
DROP TRIGGER IF EXISTS performances_modified_stamp ON performances;
DROP TRIGGER IF EXISTS challenges_created_stamp ON challenges;
DROP TRIGGER IF EXISTS challenges_modified_stamp ON challenges;
DROP TRIGGER IF EXISTS results_created_stamp ON results;
DROP TRIGGER IF EXISTS results_modified_stamp ON results;
DROP TRIGGER IF EXISTS manage_created_stamp ON manage;
DROP TRIGGER IF EXISTS manage_modified_stamp ON manage;
DROP TRIGGER IF EXISTS results_approve_created_stamp ON results_approve;
DROP TRIGGER IF EXISTS results_approve_modified_stamp ON results_approve;

/* DROP TABLES */
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS spots CASCADE;
DROP TABLE IF EXISTS performances CASCADE;
DROP TABLE IF EXISTS manage CASCADE;
DROP TABLE IF EXISTS results_approve CASCADE;

/* DROP FUNCTIONS */
DROP FUNCTION IF EXISTS switch_spots_based_on_results_one_user(resultIds int[]);
DROP FUNCTION IF EXISTS switch_spots_based_on_results(resultIds int[]);
DROP FUNCTION IF EXISTS can_sl_eval(sLRow varchar(3), resultRow varchar(3), nameNumberOne varchar(256), nameNumberTwo varchar(256));
DROP FUNCTION IF EXISTS make_challenge(uId varchar(256), pId int, sId varchar(3));
DROP FUNCTION IF EXISTS get_user_result_comments(idOne varchar(256), commentsOne text, commentsTwo text, id varchar(256));
DROP FUNCTION IF EXISTS get_other_user_id(idCompare varchar(256), idOne varchar(256), idTwo varchar(256));
DROP FUNCTION IF EXISTS created_stamp();
DROP FUNCTION IF EXISTS modified_stamp();

/* DROP TYPES */
DROP TYPE IF EXISTS part;
DROP TYPE IF EXISTS instrument;
DROP TYPE IF EXISTS role;
