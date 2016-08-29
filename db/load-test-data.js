const async = require('async');
const fs = require('fs');
const path = require('path');

const db = require('../utils').db;
const fixtures = require('../spec/fixtures');

const client = db.createClient();

client.connect();

const testManageActions = fixtures.testData.testManageActions;
const testPerformance = [fixtures.testData.testPerformance];
const testSpots = fixtures.testData.testSpots;
const testUsers = fixtures.testData.testUsers;
const insertManageActionQuery = 'INSERT INTO manage (performanceId, usernamenumber, reason, spotId, voluntary) VALUES($1, $2, $3, $4, $5)';
const insertPerformanceQueryString = 'INSERT INTO performances (name, openAt, closeAt, performDate, current) VALUES($1, $2, $3, $4, $5)';
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users (nameNumber, instrument, name, part, password, role, spotId, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

function createDb(value, cb) {
  const sql = fs.readFileSync(path.resolve(__dirname, 'schema.sql')).toString(); // eslint-disable-line no-sync

  client.query(sql, [], (err) => {
    cb(err);
  });
}

function insertManageAction(action, cb) {
  client.query(insertManageActionQuery, [action.performanceId, action.userNameNumber, action.reason, action.spotId, action.voluntary], (err) => {
    cb(err);
  });
}

function insertPerformance(performance, cb) {
  client.query(insertPerformanceQueryString, [performance.name, performance.openAt, performance.closeAt, performance.performDate, performance.current], (err) => {
    cb(err);
  });
}

function insertSpot(spot, cb) {
  client.query(insertSpotQueryString, [spot.id, spot.open, spot.challengedAmount], (err) => {
    cb(err);
  });
}

function insertUser(user, cb) {
  client.query(insertUserQueryString,
    [user.nameNumber, user.instrument, user.name, user.part, user.password, user.role, user.spotId, user.email],
    (err) => {
      cb(err);
    }
  );
}

async.map(['blah'], createDb, (err) => {
  if (err) {
    console.log('Error creating db', err);
  }
});

async.map(testPerformance, insertPerformance, (err) => {
  if (err) {
    console.log('Error inserting performances', err);
  }
});

async.map(testSpots, insertSpot, (err) => {
  if (err) {
    console.log('Error inserting spots', err);
  }
});

async.map(testUsers, insertUser, (err) => {
  if (err) {
    console.log('Error inserting users', err);
  }
});

async.map(testManageActions, insertManageAction, (err) => {
  if (err) {
    console.log('Error inserting manage actions', err);
  }
  client.end();
});
