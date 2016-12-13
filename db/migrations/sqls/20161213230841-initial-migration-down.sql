DROP TABLE performances CASCADE;
DROP TABLE spots CASCADE;
DROP TABLE users CASCADE;
DROP TABLE challenges CASCADE;
DROP TABLE results CASCADE;
DROP TABLE manage CASCADE;
DROP TABLE results_approve CASCADE;

DROP FUNCTION switch_spots_based_on_results_one_user(resultIds int[]);
DROP FUNCTION switch_spots_based_on_results(resultIds int[]);
DROP FUNCTION can_sl_eval(instrumentA varchar(256), instrumentB varchar(256), partA varchar(256), partB varchar(256));
DROP FUNCTION make_challenge(uId varchar(256), pId int, sId varchar(3));
DROP FUNCTION get_user_result_comments(idOne varchar(256), commentsOne text, commentsTwo text, id varchar(256));
DROP FUNCTION get_other_user_id(idCompare varchar(256), idOne varchar(256), idTwo varchar(256));
DROP FUNCTION created_stamp();
DROP FUNCTION modified_stamp();

DROP TYPE part;
DROP TYPE instrument;
DROP TYPE role;
