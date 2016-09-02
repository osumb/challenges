const queries = require('../db/queries');
const utils = require('../utils');

const attributes = ['id', 'performanceId', 'userNameNumber', 'spotId'];

class Challenge {

  constructor(performanceId, performanceName, spotId) {
    this._performanceId = performanceId;
    this._performanceName = performanceName;
    this._spotId = spotId;
  }

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'challenges';
  }

  static create(userId, spotId, performanceId) {
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
        resolve(returnCode);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  static findAllChallengeablePeopleForUser(user, performanceId) {
    // eslint-disable-next-line
    const sql = queries.challengeablePeople;

    return new Promise((resolve, reject) => {
      if (!performanceId) {
        resolve(null);
      }

      const client = utils.db.createClient();
      const users = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [user.instrument, user.part, user.spotId, user.nameNumber, performanceId]);

      query.on('row', ({ challengedcount, name, spotid, open }) => {
        users.push(new ChallengeableUser(challengedcount, name, spotid, open));
      });

      query.on('end', () => {
        client.end();
        resolve(users);
      });

      query.on('error', (err) => reject(err));
    });
  }

  static findAllForPerformanceCSV(performanceId) {
    const sql = queries.challengesForCSV;

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const challenges = [];

      client.connect();
      client.on('error', err => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', ({
        challengee,
        challenger,
        challengeespot,
        challengerspot,
        firstnamenumber,
        secondnamenumber,
        spotopen
      }) => {
        challenges.push(new ChallengeForCSV(
          challengee,
          challenger,
          challengeespot,
          challengerspot,
          firstnamenumber,
          secondnamenumber,
          spotopen
        ));
      });

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

  static findAllRawForPerformance(performanceId) {
    const sql = 'SELECT * FROM challenges WHERE performanceId = $1';

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

  static findForUser(nameNumber) {
    const sql = 'SELECT * FROM challenges AS C, performances AS P WHERE userNameNumber = $1 AND C.performanceId = P.id ORDER BY C.id LIMIT 1';

    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [nameNumber]);

      query.on('row', ({ name, performanceid, spotid }) => {
        client.end();
        resolve(new Challenge(performanceid, name, spotid));
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

  get performanceId() {
    return this._performanceId;
  }

  get performanceName() {
    return this._performanceName;
  }

  get spotId() {
    return this._spotId;
  }

}

class ChallengeForCSV {

  constructor(challengee, challenger, challengeeSpot, challengerSpot, firstNameNumber, secondNameNumber, spotOpen) {
    this._challengee = challengee;
    this._challenger = challenger;
    this._challengeeSpot = challengeeSpot;
    this._challengerSpot = challengerSpot;
    this._firstNameNumber = firstNameNumber;
    this._secondNameNumber = secondNameNumber;
    this._spotOpen = spotOpen;
  }

  get challengee() {
    return this._challengee;
  }

  get challenger() {
    return this._challenger;
  }

  get challengeeSpot() {
    return this._challengeeSpot;
  }

  get challengerSpot() {
    return this._challengerSpot;
  }

  get firstNameNumber() {
    return this._firstNameNumber;
  }

  get secondNameNumber() {
    return this._secondNameNumber;
  }

  get spotId() {
    return this._spotId;
  }

  get spotOpen() {
    return this._spotOpen;
  }
}

class ChallengeableUser {

  constructor(challengedCount, name, spotId, spotOpen) {
    this._challengedCount = challengedCount;
    this._name = name;
    this._spotId = spotId;
    this._spotOpen = spotOpen;
  }

  get challengeFull() {
    return this._spotOpen ? this._challengedCount >= 2 : this._challengedCount >= 1;
  }

  get challengedCount() {
    return this._challengedCount;
  }

  get name() {
    return this._name;
  }

  get spotId() {
    return this._spotId;
  }

  get spotOpen() {
    return this._spotOpen;
  }

}

module.exports = Challenge;
