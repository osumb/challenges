/* DELETE FROM all tables */
DELETE FROM users CASCADE;
DELETE FROM challenges CASCADE;
DELETE FROM results CASCADE;
DELETE FROM spots CASCADE;
DELETE FROM performances CASCADE;
DELETE FROM manage CASCADE;
DELETE FROM results_approve CASCADE;

/* reset the id_seq on each table */
SELECT setval('challenges_id_seq', 1, false);
SELECT setval('results_id_seq', 1, false);
SELECT setval('manage_id_seq', 1, false);
SELECT setval('results_approve_id_seq', 1, false);
SELECT setval('performances_id_seq', 1, false);
