'use strict';
const queries = require('./queries');
const utils = require('../utils');

class Challenge {
  makeChallenge(userId, spotId) {
    const sql = queries.makeChallenge;

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();

      client.connect();
      client.on('error', (err) => { reject(err); });

      const query = client.query(sql, [userId, spotId]);

      query.on('row', (result) => {
        client.end();
        resolve(result);
      });

      query.on('error', (err) => {
        client.end();
        reject({ error: err });
      });
    });
  }
}

module.exports = Challenge;
