const moment = require('moment');

const queries = require('../db/queries');
const { db } = require('../utils');

const modelAttributes = ['id', 'performanceId', 'spotId', 'firstNameNumber', 'secondNameNumber', 'firstComments', 'secondComments', 'winnerId', 'pending', 'needsApproval'];
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
  const performanceResultsMap = [];

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

  return performanceResultsMap.reverse();
};

class Result {

  constructor(id, fC, fNN, nA, opponentName, pending, perfDate, perfName, perfId, sC, sNN, spotId, uOA, uTA, winnerId) {
    this._id = id;
    this._firstComments = fC;
    this._firstNameNumber = fNN;
    this._needsApproval = nA;
    this._opponentName = opponentName;
    this._pending = pending;
    this._performanceDate = new Date(perfDate);
    this._performanceName = perfName;
    this._performanceId = perfId;
    this._secondComments = sC;
    this._secondNameNumber = sNN;
    this._spotId = spotId;
    this._userOneAlternate = uOA;
    this._userTwoAlternate = uTA;
    this._winnerId = winnerId;
  }

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
    const sql = 'UPDATE results SET needsApproval = FALSE, pending = FALSE WHERE id = ANY($1) RETURNING performanceId';

    return db.query(sql, [ids], ({ performanceid }) => performanceid);
  }

  static checkAllDoneForPerformance(id) {
    const sql = 'SELECT count(*) FROM results WHERE performanceid = $1 AND needsApproval';

    return db.query(sql, [id], ({ count }) => parseInt(count, 10) === 0);
  }

  static createWithClient(attributes, client) {
    const { sql, values } = db.queryBuilder(Result, attributes);

    return new Promise((resolve, reject) => {
      const query = client.query(sql, values);

      query.on('end', resolve);
      query.on('error', reject);
    });
  }

  static findAllForApproval(user) {
    const sql = queries.resultsForApproval;

    return db.query(sql, [user.instrument, user.part], instanceFromRowResultForAdmin);
  }

  static findAllForEval(nameNumber, row) {
    const sql = queries.resultsForEval;

    return db.query(sql, [nameNumber, row], instanceFromRowResultForEval);
  }

  static findAllForPerformance(performanceId) {
    const sql = queries.resultsForPerformance;

    return db.query(sql, [performanceId], instanceFromRowResultForAdmin);
  }

  static findAllRawForPerformance(performanceId) {
    const sql = 'SELECT * FROM results WHERE performanceId = $1';

    return db.query(sql, [performanceId], instanceFromRowResultForAdmin);
  }

  static findAllForUser(nameNumber) {
    const sql = queries.resultsForUser;

    return db.query(sql, [nameNumber], instanceFromRowResultForUser(nameNumber));
  }

  static index() {
    const sql = queries.resultsIndex;

    return db.query(sql, ['Any', 'Any'], instanceFromRowResultForAdmin).then(groupResultsByPerformance);
  }

  static switchSpotsForPerformance(id) {
    return new Promise((resolve, reject) => {
      const resultsSql = queries.resultsForPerformance;
      const switchSql = 'SELECT switch_spots_based_on_results($1)';
      const oneUserSql = 'SELECT switch_spots_based_on_results_one_user($1)';
      const onePersonResultIds = [];

      db.query(resultsSql, [id], instanceFromForResult)
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
    const sql = 'UPDATE results SET firstComments = $1, secondComments = $2, winnerId = $3 WHERE firstNameNumber = $4';

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

  // This function is only for results returned by findForUser
  toJSONForUser(nameNumber) {
    return {
      comments: this._firstComments,
      opponentName: this._opponentName,
      performanceDate: moment(this._performanceDate).format('MMM D, YYYY'),
      performanceName: this._performanceName,
      spotId: this._spotId,
      winner: this._winnerId === nameNumber
    };
  }
}

class ResultForAdmin {

  constructor(id, fC, fN, fNN, pending, perfId, perfName, sC, sN, sNN, spotId, winnerId) {
    this._firstComments = fC;
    this._firstName = fN;
    this._firstNameNumber = fNN;
    this._id = id;
    this._pending = pending;
    this._performanceId = perfId;
    this._performanceName = perfName;
    this._secondComments = sC;
    this._secondName = sN;
    this._secondNameNumber = sNN;
    this._spotId = spotId;
    this._winnerId = winnerId;
  }

  get firstComments() {
    return this._firstComments;
  }

  get firstName() {
    return this._firstName;
  }

  get firstNameNumber() {
    return this._firstNameNumber;
  }

  get id() {
    return this._id;
  }

  get pending() {
    return this._pending;
  }

  get performanceId() {
    return this._performanceId;
  }

  get performanceName() {
    return this._performanceName;
  }

  get secondComments() {
    return this._secondComments;
  }

  get secondName() {
    return this._secondName;
  }

  get secondNameNumber() {
    return this._secondNameNumber;
  }

  get spotId() {
    return this._spotId;
  }

  get winner() {
    return this._winnerId === this._firstNameNumber ? this._firstName : this._secondName;
  }

}

class ResultForEvaluation {

  constructor(firstName, firstNameNumber, id, secondName, secondNameNumber, spotId) {
    this._firstName = firstName;
    this._firstNameNumber = firstNameNumber;
    this._id = id;
    this._secondName = secondName;
    this._secondNameNumber = secondNameNumber;
    this._spotId = spotId;
  }

  get firstName() {
    return this._firstName;
  }

  get firstNameNumber() {
    return this._firstNameNumber;
  }

  get resultId() {
    return this._id;
  }

  get secondName() {
    return this._secondName;
  }

  get secondNameNumber() {
    return this._secondNameNumber;
  }

  get spotId() {
    return this._spotId;
  }

}

class ResultForUser {

  constructor(comments, opponentName, performanceDate, performanceId, performanceName, spotId, userNameNumber, winner) {
    this._comments = comments;
    this._opponentName = opponentName;
    this._performanceDate = moment(performanceDate).format('MMMM D, YYYY');
    this._performanceId = performanceId;
    this._performanceName = performanceName;
    this._spotId = spotId;
    this._winner = winner === userNameNumber;
  }

  get comments() {
    return this._comments;
  }

  get opponentName() {
    return this._opponentName;
  }

  get performanceDate() {
    return this._performanceDate;
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

  get winner() {
    return this._winner;
  }

  toJSON() {
    return {
      comments: this._comments,
      id: this._id,
      opponentName: this._opponentName,
      performanceDate: this._performanceDate,
      performanceId: this._performanceId,
      performanceName: this._performanceName,
      spotId: this._spotId,
      winner: this._winner
    };
  }
}

const instanceFromRowResultForAdmin = ({
  resultid,
  firstcomments,
  nameone,
  firstnamenumber,
  pending,
  performanceid,
  performancename,
  secondcomments,
  nametwo,
  secondnamenumber,
  spotid,
  winnerid
}) => new ResultForAdmin(
  resultid,
  firstcomments,
  nameone,
  firstnamenumber,
  pending,
  performanceid,
  performancename,
  secondcomments,
  nametwo,
  secondnamenumber,
  spotid,
  winnerid
);

const instanceFromRowResultForEval = ({
  nameone,
  firstnamenumber,
  resultid,
  nametwo,
  secondnamenumber,
  spotid
}) => new ResultForEvaluation(nameone, firstnamenumber, resultid, nametwo, secondnamenumber, spotid);

const instanceFromRowResultForUser = (nameNumber) =>
  ({ comments, opponentname, performdate, performanceid, name, spotid, winnerid }) =>
    new ResultForUser(comments, opponentname, performdate, performanceid, name, spotid, nameNumber, winnerid);

const instanceFromForResult = ({
  id,
  firstcomments,
  firstnamenumber,
  needsapproval,
  opponentname,
  pending,
  performdate,
  name,
  performanceid,
  secondcomments,
  secondnamenumber,
  spotid,
  useronealternate,
  usertwoalternate,
  winnerid
}) => new Result(
  id,
  firstcomments,
  firstnamenumber,
  needsapproval,
  opponentname,
  pending,
  performdate,
  name,
  performanceid,
  secondcomments,
  secondnamenumber,
  spotid,
  useronealternate,
  usertwoalternate,
  winnerid
);

module.exports = Result;
