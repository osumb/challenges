const async = require('async');
const fs = require('fs');
const path = require('path');

const db = require('../utils').db;

const client = db.createClient();

client.connect();

function createDb(value, cb) {
  const sql = fs.readFileSync(path.resolve(__dirname, 'schema.sql')).toString(); // eslint-disable-line no-sync

  client.query(sql, [], (err) => {
    cb(err);
  });
}

async.map(['blah'], createDb, (err) => {
  if (err) {
    console.log('Error creating db', err);
  }

  client.end();
});
