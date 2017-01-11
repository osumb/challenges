const db = require('../utils/db');
const seedData = require('../spec/fixtures/seed');

const {
  challengeList,
  performances,
  results,
  spots,
  users
} = seedData;

const [performance] = performances;
const insertChallengeQueryString = `INSERT INTO challenges (performance_id, user_name_number, spot_id) VALUES(${performance.id}, $1, $2)`;
const insertPerformanceQueryString = 'INSERT INTO performances (name, open_at, close_at, perform_date) VALUES($1, $2, $3, $4)';
const insertResultQueryString = `INSERT INTO results (performance_id, spot_id, first_name_number, second_name_number, first_comments, second_comments, winner_id, pending) VALUES(${performance.id}, $1, $2, $3, $4, $5, $6, $7)`;
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users (name_number, instrument, name, part, password, role, spot_id, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

const insertChallenge = (challenge) =>
  db.query(insertChallengeQueryString, [challenge.userNameNumber, challenge.spotId]);

const insertPerformance = (seedPerformance) =>
  db.query(insertPerformanceQueryString, [seedPerformance.name, seedPerformance.openAt, seedPerformance.closeAt, seedPerformance.performDate]);

const insertResult = (result) =>
  db.query(insertResultQueryString,
    [result.spotId, result.firstNameNumber, result.secondNameNumber, result.comments1, result.comments2, result.winnerId, result.pending]);

const insertSpot = (spot) =>
  db.query(insertSpotQueryString, [spot.id, spot.open, spot.challengedAmount]);

const insertUser = (user) =>
  db.query(insertUserQueryString,
    [user.nameNumber, user.instrument, user.name, user.part, user.password, user.role, user.spotId, user.email]);

const loadChallenges = () => Promise.all(challengeList.map(insertChallenge));
const loadPerformances = () => insertPerformance(performance);
const loadResults = () => Promise.all(results.map(insertResult));
const loadSpots = () => Promise.all(spots.map(insertSpot));
const loadUsers = () => Promise.all(users.map(insertUser));

loadPerformances().then(loadSpots).then(loadUsers).then(loadChallenges).then(loadResults)
.then(() => {
  db.closePool();
})
.catch((err) => {
  db.closePool();
  console.error(err);
});
