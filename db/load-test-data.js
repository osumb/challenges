const { db } = require('../utils');
const fixtures = require('../spec/fixtures');

const testManageActions = fixtures.testData.testManageActions;
const testPerformance = fixtures.testData.testPerformance;
const testSpots = fixtures.testData.testSpots;
const testUsers = fixtures.testData.testUsers;
const insertManageActionQuery = 'INSERT INTO manage (performanceId, usernamenumber, reason, spotId, voluntary) VALUES($1, $2, $3, $4, $5)';
const insertPerformanceQueryString = 'INSERT INTO performances (name, openAt, closeAt, performDate) VALUES($1, $2, $3, $4)';
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users (nameNumber, instrument, name, part, password, role, spotId, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

const insertManageAction = (action) => {
  return db.query(insertManageActionQuery, [action.performanceId, action.userNameNumber, action.reason, action.spotId, action.voluntary]);
};

const insertPerformance = (performance) => {
  return db.query(insertPerformanceQueryString, [performance.name, performance.openAt, performance.closeAt, performance.performDate]);
};

const insertSpot = (spot) => {
  return db.query(insertSpotQueryString, [spot.id, spot.open, spot.challengedAmount]);
};

const insertUser = (user) => {
  return db.query(insertUserQueryString,
    [user.nameNumber, user.instrument, user.name, user.part, user.password, user.role, user.spotId, user.email]);
};

const performances = () => insertPerformance(testPerformance);
const spots = () => Promise.all(testSpots.map(insertSpot));
const users = () => Promise.all(testUsers.map(insertUser));
const manageActions = () => Promise.all(testManageActions.map(insertManageAction));

performances().then(spots).then(users).then(manageActions)
.then(() => {
  db.closePool();
})
.catch((err) => {
  db.closePool();
  throw err;
});
