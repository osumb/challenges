const moment = require('moment');

const db = require('../../utils/db');
const Model = require('./model');
const queries = require('../../db/queries');
const { snakeCase } = require('../../utils/object-keys-case-change');

const modelAttributes = ['id', 'performance_id', 'spot_id', 'first_name_number', 'second_name_number', 'first_comments', 'second_comments', 'winner_id', 'pending', 'needs_approval'];
const alternateVersusRegular = result =>
  (!result.userOneAlternate && result.userTwoAlternate) ||
  (result.userOneAlternate && !result.userTwoAlternate);
const alternateVersusAlternate = result =>
  result.userOneAlternate && result.userTwoAlternate;
const regularVersusRegular = result =>
  !result.userOneAlternate && !result.userTwoAlternate;

/*
  We need a special sorting for results when we're switching user spots based on results
  - Regular VS Alternate
  - Alternate VS Alternate
  - Regular VS Regular
  This grossness does that
*/
const resultsSort = (a, b) => { // eslint-disable-line consistent-return, array-callback-return
  if (alternateVersusRegular(a) && alternateVersusRegular(b)) return 0;
  if (alternateVersusRegular(a) && alternateVersusAlternate(b)) return -1;
  if (alternateVersusRegular(a) && regularVersusRegular(b)) return -1;
  if (alternateVersusAlternate(a) && alternateVersusRegular(b)) return 1;
  if (alternateVersusAlternate(a) && alternateVersusAlternate(b)) return 0;
  if (alternateVersusAlternate(a) && regularVersusRegular(b)) return -1;
  if (regularVersusRegular(a) && alternateVersusRegular(b)) return 1;
  if (regularVersusRegular(a) && alternateVersusAlternate(b)) return 1;
  if (regularVersusRegular(a) && regularVersusRegular(b)) return 0;
};

const sortBySpotId = (a, b) => a.spotId[0] === b.spotId[0] ?
  parseInt(a.spotId.substring(1), 10) > parseInt(b.spotId.substring(1), 10) :
  a.spotId.localeCompare(b.spotId);

const groupResultsByPerformance = (results) => {
  const performanceResultsMap = {};

  results.sort(sortBySpotId);

  results.forEach((result) => {
    const { performanceId, performanceName } = result;

    if (performanceResultsMap[performanceId]) {
      performanceResultsMap[performanceId].results.push(result);
    } else {
      performanceResultsMap[performanceId] = {
        performanceName,
        results: [result]
      };
    }
  });

  return performanceResultsMap;
};

class Result extends Model {

  static get attributes() {
    return modelAttributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'results';
  }

  static approve(ids) {
    const sql = 'UPDATE results SET needs_approval = FALSE, pending = FALSE WHERE id = ANY($1) RETURNING performance_id';

    return db.query(sql, [ids], ({ performanceid }) => performanceid);
  }

  static checkAllDoneForPerformance(id) {
    const sql = 'SELECT count(*) FROM results WHERE performance_id = $1 AND needs_approval';

    return db.query(sql, [id], ({ count }) => parseInt(count, 10) === 0);
  }

  static createWithClient(attributes, client) {
    const { sql, values } = db.queryBuilder(Result, snakeCase(attributes));

    return new Promise((resolve, reject) => {
      const query = client.query(sql, values);

      query.on('end', resolve);
      query.on('error', reject);
    });
  }

  static findAllForApproval(user) {
    const sql = queries.resultsForApproval;

    return db.query(sql, [user.instrument, user.part], instanceFromRow);
  }

  static findAllForEval(nameNumber, row) {
    const sql = queries.resultsForEval;

    return db.query(sql, [nameNumber, row], instanceFromRow);
  }

  static findAllForPerformance(performanceId) {
    const sql = queries.resultsForPerformance;

    return db.query(sql, [performanceId], instanceFromRow);
  }

  static findAllRawForPerformance(performanceId) {
    const sql = 'SELECT * FROM results WHERE performance_id = $1';

    return db.query(sql, [performanceId], instanceFromRow);
  }

  static findAllForUser(nameNumber) {
    const sql = queries.resultsForUser;

    return db.query(sql, [nameNumber], instanceFromRow);
  }

  static index() {
    const sql = queries.resultsIndex;

    return db.query(sql, ['Any', 'Any'], instanceFromRow).then(groupResultsByPerformance);
  }

  static switchSpotsForPerformance(id) {
    return new Promise((resolve, reject) => {
      const resultsSql = queries.resultsForPerformance;
      const switchSql = 'SELECT switch_spots_based_on_results($1)';
      const oneUserSql = 'SELECT switch_spots_based_on_results_one_user($1)';
      const onePersonResultIds = [];

      db.query(resultsSql, [id], instanceFromRow)
      .then((results) => {
        const filteredResults = results.filter(({ secondNameNumber }, i) => {
          if (!secondNameNumber) {
            onePersonResultIds.push(results[i].id);
          }
          return secondNameNumber;
        });
        const filteredResultsIds = filteredResults.sort(resultsSort).map(({ id: resultId }) => resultId);

        db.query(switchSql, [filteredResultsIds])
        .then(() => {
          db.query(oneUserSql, [onePersonResultIds])
          .then(resolve)
          .catch(reject);
        })
        .catch(reject);
      })
      .catch(reject);
    });
  }

  static update(attributes) {
    const id = attributes.id;

    if (typeof id === 'undefined') {
      return Promise.reject(new Error('No id provided with attributes'));
    }

    delete attributes.id;
    const { sql, values } = db.queryBuilder(Result, attributes, { statement: 'UPDATE', id });

    return db.query(sql, values);
  }

  static updateForTestsOnly(firstNameNumber, comments1, comments2, winnerId) {
    const sql = 'UPDATE results SET first_comments = $1, second_comments = $2, winner_id = $3 WHERE first_name_number = $4';

    return db.query(sql, [comments1, comments2 || null, winnerId, firstNameNumber]);
  }

  get id() {
    return this._id;
  }

  get firstComments() {
    return this._firstComments;
  }

  get firstNameNumber() {
    return this._firstNameNumber;
  }

  get needsApproval() {
    return this._needsApproval;
  }

  get opponentName() {
    return this._opponentName;
  }

  get pending() {
    return this._pending;
  }

  get performanceId() {
    return this._performanceId;
  }

  get secondComments() {
    return this._secondComments;
  }

  get secondNameNumber() {
    return this._secondNameNumber;
  }

  get spotId() {
    return this._spotId;
  }

  get userOneAlternate() {
    return this._userOneAlternate;
  }

  get userTwoAlternate() {
    return this._userTwoAlternate;
  }

  get comments() {
    return this._comments;
  }

  get performanceDate() {
    return this._performanceDate;
  }

  get performanceName() {
    return this._performanceName;
  }

  get winner() {
    return this._winner;
  }

  get firstName() {
    return this._firstName;
  }

  get secondName() {
    return this._secondName;
  }

  get resultId() {
    return this._id;
  }

  toJSON(nameNumber) {
    return {
      comments: this._comments,
      firstComments: this._firstComments,
      firstName: this._firstName,
      firstNameNumber: this._firstNameNumber,
      id: this._id,
      opponentName: this._opponentName,
      pending: this._pending,
      performanceDate: moment(this._performDate).format('MMM D, YYYY'),
      performanceId: this._performanceId,
      performanceName: this._performanceName,
      secondComments: this._secondComments,
      secondName: this._secondName,
      secondNameNumber: this._secondNameNumber,
      spotId: this._spotId,
      winner: this._winnerId === nameNumber,
      winnerId: this._winnerId
    };
  }
}

const instanceFromRow = (props) => new Result(props);

module.exports = Result;
