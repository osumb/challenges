const db = require('../utils/db');
const testData = require('../spec/fixtures/test');

const {
  manageActions,
  performance,
  spots,
  users
} = testData;

const insertManageActionQuery = 'INSERT INTO manage (performanceId, usernamenumber, reason, spotId, voluntary) VALUES($1, $2, $3, $4, $5)';
const insertPerformanceQueryString = 'INSERT INTO performances (name, openAt, closeAt, performDate) VALUES($1, $2, $3, $4)';
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users (nameNumber, instrument, name, part, password, role, spotId, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

const insertManageAction = (action) => {
  return db.query(insertManageActionQuery, [action.performanceId, action.userNameNumber, action.reason, action.spotId, action.voluntary]);
};

const insertPerformance = (perf) => {
  return db.query(insertPerformanceQueryString, [perf.name, perf.openAt, perf.closeAt, perf.performDate]);
};

const insertSpot = (spot) => {
  return db.query(insertSpotQueryString, [spot.id, spot.open, spot.challengedAmount]);
};

const insertUser = (user) => {
  return db.query(insertUserQueryString,
    [user.nameNumber, user.instrument, user.name, user.part, user.password, user.role, user.spotId, user.email]);
};

const loadPerformances = () => insertPerformance(performance);
const loadSpots = () => Promise.all(spots.map(insertSpot));
const loadUsers = () => Promise.all(users.map(insertUser));
const loadManageActions = () => Promise.all(manageActions.map(insertManageAction));

loadPerformances().then(loadSpots).then(loadUsers).then(loadManageActions).then(() => {
  db.closePool();
})
.catch((err) => {
  db.closePool();
  console.error(err);
});
