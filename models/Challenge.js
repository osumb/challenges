const queries = require('./queries');
const utils = require('../utils');

class Challenge {
  getForUser(nameNumber) {
    const sql = 'SELECT * FROM challenges AS C, performances AS P WHERE userNameNumber = $1 AND C.performanceId = P.id ORDER BY C.id LIMIT 1';
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [nameNumber]);

      query.on('row', (result) => {
        client.end();
        resolve(this.parse(result));
      });
      query.on('end', () => {
        client.end();
        resolve(null);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

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
        reject(err);
      });
    });
  }

  parse(challenge) {
    return {
      spotId: challenge.spotid,
      performanceName: challenge.name
    };
  }
}

module.exports = Challenge;
