const async = require('async');
const fs = require('fs');
const path = require('path');

const db = require('../utils').db;
const mockData = require('../spec/fixtures');

const client = db.createClient();

client.connect();

const challenges = mockData.fakeChallengeList;
const performances = mockData.fakePerformances;
const results = mockData.fakeResults;
const resultsApprove = mockData.fakeResultsApprove;
const spots = mockData.fakeSpots;
const users = mockData.fakeUsers;
const insertChallengeQueryString = 'INSERT INTO challenges (performanceId, userNameNumber, spotId) VALUES($1, $2, $3)';
const insertPerformanceQueryString = 'INSERT INTO performances (name, openAt, closeAt, performDate, current) VALUES($1, $2, $3, $4, $5)';
const insertResultQueryString = 'INSERT INTO results (performanceId, spotId, firstNameNumber, secondNameNumber, firstComments, secondComments, winnerId, pending) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
const insertResultsApproveQueryString = 'INSERT INTO results_approve (userNameNumber, instrument, part) VALUES($1, $2, $3)';
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)';

function createDb(value, cb) {
  const sql = fs.readFileSync(path.resolve(__dirname, 'schema.sql')).toString(); // eslint-disable-line no-sync

  client.query(sql, [], (err) => {
    cb(err);
  });
}

function insertChallenge(challenge, cb) {
  client.query(insertChallengeQueryString, [challenge.PerformanceId, challenge.UserNameNumber, challenge.SpotId],
    (err) => {
      cb(err);
    }
  );
}

function insertPerformance(performance, cb) {
  client.query(insertPerformanceQueryString, [performance.name, performance.openAt, performance.closeAt, performance.performDate, performance.current], (err) => {
    cb(err);
  });
}

function insertResult(result, cb) {
  client.query(insertResultQueryString, [result.PerformanceId, result.SpotId, result.firstNameNumber, result.secondNameNumber, result.comments1, result.comments2, result.winnerId, result.pending], (err) => {
    cb(err);
  });
}

function insertResultsApprove(user, cb) {
  client.query(insertResultsApproveQueryString, [user.userNameNumber, user.instrument, user.part], (err) => {
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
    [user.nameNumber, user.instrument, user.name, user.part, user.password, user.role, user.spotId],
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

async.map(performances, insertPerformance, (err) => {
  if (err) {
    console.log('Error inserting performances', err);
  }
});

async.map(spots, insertSpot, (err) => {
  if (err) {
    console.log('Error inserting spots', err);
  }
});

async.map(users, insertUser, (err) => {
  if (err) {
    console.log('Error inserting users', err);
  }
});

async.map(challenges, insertChallenge, (err) => {
  if (err) {
    console.log('Error inserting challenges', err);
  }
});

async.map(results, insertResult, (err) => {
  if (err) {
    console.log('Error inserting results', err);
  }
});

async.map(resultsApprove, insertResultsApprove, (err) => {
  if (err) {
    console.log('Error inserting resultsApprove', err);
  }
  client.end();
});
