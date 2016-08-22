----------------------------------------
-- TABLES
----------------------------------------
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS spots CASCADE;
DROP TABLE IF EXISTS performances CASCADE;
DROP TABLE IF EXISTS manage CASCADE;
DROP TABLE IF EXISTS results_approve CASCADE;

----------------------------------------
-- FUNCTIONS
----------------------------------------
DROP FUNCTION IF EXISTS switch_spots_based_on_results_one_user(resultIds int[]);
DROP FUNCTION IF EXISTS switch_spots_based_on_results(resultIds int[]);
DROP FUNCTION IF EXISTS can_sl_eval(instrumentA varchar(256), instrumentB varchar(256), partA varchar(256), partB varchar(256));
DROP FUNCTION IF EXISTS make_challenge(uId varchar(256), pId int, sId varchar(3));
DROP FUNCTION IF EXISTS get_user_result_comments(idOne varchar(256), commentsOne text, commentsTwo text, id varchar(256));
DROP FUNCTION IF EXISTS get_other_user_id(idCompare varchar(256), idOne varchar(256), idTwo varchar(256));
DROP FUNCTION IF EXISTS created_stamp()
DROP FUNCTION IF EXISTS modified_stamp()

----------------------------------------
-- TYPE
----------------------------------------
DROP TYPE IF EXISTS part;
DROP TYPE IF EXISTS instrument;
DROP TYPE IF EXISTS role;
