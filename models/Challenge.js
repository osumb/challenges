const queries = require('../db/queries');
const { db } = require('../utils');

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
    return new Promise((resolve, reject) => {
      const sql = 'SELECT make_challenge($1, $2, $3)';

      db.query(sql, [userId, performanceId, spotId], codeFromRow)
      .then(resolve)
      .catch(reject);
    });
  }

  static findAllChallengeablePeopleForUser(user, performanceId) {
    return new Promise((resolve, reject) => {
      if (!performanceId) {
        resolve(null);
      }
      const sql = queries.challengeablePeople;

      db.query(sql, [user.instrument, user.part, user.spotId, user.nameNumber, performanceId], instanceFromRowChallengeableUser)
      .then(resolve)
      .catch(reject);
    });
  }

  static findAllForPerformanceCSV(performanceId) {
    return new Promise((resolve, reject) => {
      const sql = queries.challengesForCSV;

      db.query(sql, [performanceId], instanceFromRowChallengeForCSV)
      .then(resolve)
      .catch(reject);
    });
  }

  static findAllRawForPerformance(performanceId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM challenges WHERE performanceId = $1';

      db.query(sql, [performanceId])
      .then(resolve)
      .catch(reject);
    });
  }

  static findForUser(nameNumber) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM challenges AS C, performances AS P WHERE userNameNumber = $1 AND C.performanceId = P.id ORDER BY C.id LIMIT 1';

      db.query(sql, [nameNumber], instanceFromRowChallenge)
      .then(resolve)
      .catch(reject);
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

const codeFromRow = ({ make_challenge }) => make_challenge;

const instanceFromRowChallenge = ({ name, performanceid, spotid }) =>
  new Challenge(performanceid, name, spotid);

const instanceFromRowChallengeableUser = ({ challengedcount, name, spotid, open }) =>
  new ChallengeableUser(challengedcount, name, spotid, open);

const instanceFromRowChallengeForCSV = ({ challengee, challenger, challengeespot, challengerspot, firstnamenumber, secondnamenumber, spotopen }) =>
  new ChallengeForCSV(challengee, challenger, challengeespot, challengerspot, firstnamenumber, secondnamenumber, spotopen);

module.exports = Challenge;
