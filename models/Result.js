'use strict';
const queries = require('./queries');
const utils = require('../utils');

function parseForUser(userNameNumber, result) {
  delete result.id;
  result.winner = userNameNumber === result.winnerId;
  delete result.winnerId;
  return result;
}

module.exports = class Results {
  getAllForUser(nameNumber) {
    const client = utils.db.createClient();
    const sql = queries.resultsForUser;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => {reject(err);});

      const query = client.query(sql, [nameNumber]);
      query.on('row', (result) => {results.push(parseForUser(nameNumber, result));});

      query.on('end', () => {
        client.end();
        resolve(results);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }
};
