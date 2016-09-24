const { db } = require('../utils');
const fixtures = require('../spec/fixtures');

const seedChallenges = fixtures.seedData.fakeChallengeList;
const seedPerformances = fixtures.seedData.fakePerformances;
const seedResults = fixtures.seedData.fakeResults;
const seedResultsApprove = fixtures.seedData.fakeResultsApprove;
const seedSpots = fixtures.seedData.fakeSpots;
const seedUsers = fixtures.seedData.fakeUsers;
const insertChallengeQueryString = 'INSERT INTO challenges (performanceId, userNameNumber, spotId) VALUES($1, $2, $3)';
const insertPerformanceQueryString = 'INSERT INTO performances (name, openAt, closeAt, performDate) VALUES($1, $2, $3, $4)';
const insertResultQueryString = 'INSERT INTO results (performanceId, spotId, firstNameNumber, secondNameNumber, firstComments, secondComments, winnerId, pending) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
const insertResultsApproveQueryString = 'INSERT INTO results_approve (userNameNumber, instrument, part) VALUES($1, $2, $3)';
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users (nameNumber, instrument, name, part, password, role, spotId, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

const insertChallenge = (challenge) => {
  return db.query(insertChallengeQueryString, [challenge.PerformanceId, challenge.UserNameNumber, challenge.SpotId]);
};

const insertPerformance = (performance) => {
  return db.query(insertPerformanceQueryString, [performance.name, performance.openAt, performance.closeAt, performance.performDate]);
};

const insertResult = (result) => {
  return db.query(insertResultQueryString, [result.PerformanceId, result.SpotId, result.firstNameNumber, result.secondNameNumber, result.comments1, result.comments2, result.winnerId, result.pending]);
};

const insertResultsApprove = (user) => {
  return db.query(insertResultsApproveQueryString, [user.userNameNumber, user.instrument, user.part]);
};

const insertSpot = (spot) => {
  return db.query(insertSpotQueryString, [spot.id, spot.open, spot.challengedAmount]);
};

const insertUser = (user) => {
  return db.query(insertUserQueryString,
    [user.nameNumber, user.instrument, user.name, user.part, user.password, user.role, user.spotId, user.email]);
};

const performances = () => Promise.all(seedPerformances.map(insertPerformance));
const spots = () => Promise.all(seedSpots.map(insertSpot));
const users = () => Promise.all(seedUsers.map(insertUser));
const challenges = () => Promise.all(seedChallenges.map(insertChallenge));
const results = () => Promise.all(seedResults.map(insertResult));
const resultsApprove = () => Promise.all(seedResultsApprove.map(insertResultsApprove));

performances().then(spots).then(users).then(challenges).then(results).then(resultsApprove)
.then(() => {
  db.closePool();
})
.catch((err) => {
  db.closePool();
  throw err;
});
