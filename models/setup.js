'use strict';
const async = require('async');
const fs = require('fs');
const path = require('path');

const config = require('../config/config');
const mockData = require('./mock-data');
const db = require('../utils').db;

const client = db.createClient();

client.connect();

const spots = mockData.getSpotsFromExcelFile(config.db.fakeSpotDataPath);
const users = mockData.getUsersFromExcelFile(config.db.fakeUserDataPath);
const insertSpotQueryString = 'INSERT INTO spots VALUES ($1, $2, $3)';
const insertUserQueryString = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

function createDb(value, cb) {
  const sql = fs.readFileSync(path.resolve(__dirname, 'schema.sql')).toString();

  client.query(sql, [], (err) => {
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
    [user.nameNumber, user.spotId, user.name, user.password, user.instrument, user.part, user.eligible, user.squadLeader, user.admin],
    (err) => {
      cb(err);
    }
  );
}

async.map(['blah'], createDb, (err) => {
  if (err) {
    console.log('Error creating db', err);
  } else {
    console.log('Tables setup');
  }
});

async.map(spots, insertSpot, (err) => {
  if (err) {
    console.log('Error inserting spots', err);
  } else {
    console.log('Done inserting spots!!');
  }
});

async.map(users, insertUser, (err) => {
  if (err) {
    console.log('Error inserting users', err);
  } else {
    console.log('Done inserting users!!');
  }
  client.end();
});
