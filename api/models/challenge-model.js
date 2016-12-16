const db = require('../../utils/db');
const queries = require('../../db/queries');

const attributes = ['id', 'performance_id', 'user_name_number', 'spot_id'];

class Challenge {

  constructor(id, performanceId, performanceName, spotId) {
    this._id = id;
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

    return db.query(sql, [userId, performanceId, spotId], codeFromRow);
  }

  static findAllChallengeablePeopleForUser(user, performanceId) {
    if (!performanceId) {
      return Promise.resolve(null);
    }
    const sql = queries.challengeablePeople;

    return db.query(
      sql,
      [user.instrument, user.part, user.spotId, user.nameNumber, performanceId],
      instanceFromRowChallengeableUser
    );
  }

  static findAllForPerformanceCSV(performanceId) {
    const sql = queries.challengesForCSV;

    return db.query(sql, [performanceId], instanceFromRowChallengeForCSV);
  }

  static findAllforEmptyResultsCreation(performanceId) {
    const sql = queries.challengesForEmptyResults;

    return db.query(sql, [performanceId], instanceFromRowChallengeForCSV);
  }

  static findAllRawForPerformance(performanceId) {
    const sql = 'SELECT * FROM challenges WHERE performance_id = $1';

    return db.query(sql, [performanceId]);
  }

  static findForUser(nameNumber) {
    const sql = 'SELECT * FROM challenges AS C, performances AS P WHERE user_name_number = $1 AND C.performance_id = P.id ORDER BY C.id LIMIT 1';

    return db.query(sql, [nameNumber], instanceFromRowChallenge);
  }

  get id() {
    return this._id;
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

  toJSON() {
    return {
      id: this._id,
      performanceId: this._performanceId,
      performanceName: this._performanceName,
      spotId: this._spotId
    };
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

  toJSON() {
    return {
      challengedCount: this._challengedCount,
      challengeFull: this._spotOpen ? this._challengedCount >= 2 : this._challengedCount >= 1,
      name: this._name,
      spotId: this._spotId,
      spotOpen: this._spotOpen
    };
  }
}

const codeFromRow = ({ make_challenge }) => make_challenge;

const instanceFromRowChallenge = ({ id, name, performance_id, spot_id }) =>
  new Challenge(id, performance_id, name, spot_id);

const instanceFromRowChallengeableUser = ({ challenged_count, name, spot_id, open }) =>
  new ChallengeableUser(challenged_count, name, spot_id, open);

const instanceFromRowChallengeForCSV = ({ challengee, challenger, challengee_spot, challenger_spot, first_name_number, second_name_number, spot_open }) =>
  new ChallengeForCSV(challengee, challenger, challengee_spot, challenger_spot, first_name_number, second_name_number, spot_open);

module.exports = Challenge;
