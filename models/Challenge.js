const utils = require('../utils');

class Challenge {
  getAllChallengeablePeopleForUser(user) {
    const sql = `SELECT * FROM spots AS S, users AS U WHERE u.instrument = $1 AND u.part = $2 AND u.eligible = FALSE AND S.id = U.spotId ORDER BY (substring(s.id, '^[A-X]'), substring(s.id, '[0-9]+')::int)`;

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const users = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [user.instrument, user.part]);

      query.on('row', (user) => users.push(this.parseChallengeAblePerson(user)));
      query.on('end', () => {
        client.end();
        resolve(users);
      });
      query.on('error', (err) => reject(err));
    });
  }

  getForUser(nameNumber) {
    const sql = 'SELECT * FROM challenges AS C, performances AS P WHERE userNameNumber = $1 AND C.performanceId = P.id ORDER BY C.id LIMIT 1';
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [nameNumber]);

      query.on('row', (result) => {
        client.end();
        resolve(this.parseChallenge(result));
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

  makeChallenge(userId, spotId, performanceId) {
    const sql = 'SELECT make_challenge($1, $2, $3)';

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      let challengeMessage = '';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [ userId, performanceId, spotId ]);

      query.on('row', (message) => {
        challengeMessage = message.make_challenge;
      });

      query.on('end', () => {
        client.end();
        return challengeMessage === '' ? resolve() : reject(challengeMessage);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  parseChallenge(challenge) {
    return {
      spotId: challenge.spotid,
      performanceName: challenge.name
    };
  }

  parseChallengeAblePerson(challenge) {
    return {
      challengedCount: challenge.challengedcount,
      name: challenge.name,
      spotOpen: challenge.open,
      spotId: challenge.spotid
    };
  }
}

module.exports = Challenge;
