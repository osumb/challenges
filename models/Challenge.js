const queries = require('../db/queries');
const utils = require('../utils');

const attributes = ['id', 'performanceId', 'userNameNumber', 'spotId'];

class Challenge {

  static getAttributes() {
    return attributes;
  }

  static getIdName() {
    return 'id';
  }

  static getTableName() {
    return 'challenges';
  }

  create(userId, spotId, performanceId) {
    const sql = 'SELECT make_challenge($1, $2, $3)';

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      let returnCode;

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [userId, performanceId, spotId]);

      query.on('row', ({ make_challenge }) => {
        returnCode = parseInt(make_challenge, 10);
      });
      query.on('end', () => {
        client.end();
        return returnCode === 0 ? resolve() : reject(returnCode);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  findAllChallengeablePeopleForUser(user, performanceId) {
    // eslint-disable-next-line
    const sql = queries.challengeablePeople;

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const users = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [user.instrument, user.part, user.spotId, user.nameNumber, performanceId]);

      query.on('row', (dbUser) => users.push(this.parseChallengeAblePerson(dbUser)));
      query.on('end', () => {
        client.end();
        resolve(users);
      });
      query.on('error', (err) => reject(err));
    });
  }

  findAllForPerformanceCSV(performanceId) {
    const sql = queries.challengesForCSV;

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const challenges = [];

      client.connect();
      client.on('error', err => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', challenge => challenges.push(challenge));
      query.on('end', () => {
        client.end();
        resolve(challenges);
      });
      query.on('error', err => {
        client.end();
        reject(err);
      });
    });
  }

  findForUser(nameNumber) {
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

  parseChallenge(challenge) {
    return {
      spotId: challenge.spotid,
      performanceName: challenge.name
    };
  }

  parseChallengeAblePerson(challenge) {
    return {
      challengedCount: challenge.challengedcount,
      challengeFull: challenge.open ? challenge.challengedcount === 2 : challenge.challengedcount === 1,
      name: challenge.name,
      spotOpen: challenge.open,
      spotId: challenge.spotid
    };
  }
}

module.exports = Challenge;
