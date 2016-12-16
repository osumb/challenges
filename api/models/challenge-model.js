const db = require('../../utils/db');
const Model = require('./model');
const queries = require('../../db/queries');

const attributes = ['id', 'performance_id', 'user_name_number', 'spot_id'];

class Challenge extends Model {

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
      instanceFromRow
    );
  }

  static findAllForPerformanceCSV(performanceId) {
    const sql = queries.challengesForCSV;

    return db.query(sql, [performanceId], instanceFromRow);
  }

  static findAllforEmptyResultsCreation(performanceId) {
    const sql = queries.challengesForEmptyResults;

    return db.query(sql, [performanceId], instanceFromRow);
  }

  static findAllRawForPerformance(performanceId) {
    const sql = 'SELECT * FROM challenges WHERE performance_id = $1';

    return db.query(sql, [performanceId]);
  }

  static findForUser(nameNumber) {
    const sql = 'SELECT * FROM challenges AS C, performances AS P WHERE user_name_number = $1 AND C.performance_id = P.id ORDER BY C.id LIMIT 1';

    return db.query(sql, [nameNumber], instanceFromRow);
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

  get challengeFull() {
    return this._spotOpen ? this._challengedCount >= 2 : this._challengedCount >= 1;
  }

  get challengedCount() {
    return this._challengedCount;
  }

  get name() {
    return this._name;
  }

  get spotOpen() {
    return this._spotOpen;
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

  toJSON() {
    return {
      challengedCount: this._challengedCount,
      challengeFull: this._spotOpen ? this._challengedCount >= 2 : this._challengedCount >= 1,
      id: this._id,
      name: this._name,
      performanceId: this._performanceId,
      performanceName: this._performanceName,
      spotId: this._spotId,
      spotOpen: this._spotOpen
    };
  }
}

const codeFromRow = ({ make_challenge }) => make_challenge;

const instanceFromRow = (props) => new Challenge(props);

module.exports = Challenge;
