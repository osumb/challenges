const moment = require('moment');

const queries = require('../db/queries');
const { db, logger } = require('../utils');

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
    const client = db.createClient();
    const sql = 'UPDATE results SET needsApproval = FALSE, pending = FALSE WHERE id = ANY($1) RETURNING performanceId';
    let performanceId;

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [ids]);

      query.on('row', ({ performanceid }) => {
        performanceId = performanceid;
      });

      query.on('end', () => {
        client.end();
        resolve(performanceId);
      });
      query.on('error', (err) => {
        reject(err);
        client.end();
      });
    });
  }

  static checkAllDoneForPerformance(id) {
    const client = db.createClient();
    const sql = 'SELECT count(*) FROM results WHERE performanceid = $1 AND needsApproval';
    let count;

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [id]);

      query.on('row', result => {
        count = parseInt(result.count, 10);
      });
      query.on('end', () => {
        client.end();
        resolve(count === 0);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
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
    const client = db.createClient();
    const sql = queries.resultsForApproval;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [user.instrument, user.part]);

      query.on('row', (resultRow) =>
        results.push(instanceFromDBRow(resultRow))
      );

      query.on('end', () => {
        client.end();
        resolve(results);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  static findAllForEval(nameNumber, row) {
    const client = db.createClient();
    const sql = queries.resultsForEval;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [nameNumber, row]);

      query.on('row', (resultRow) => results.push(instanceFromDBRow(resultRow)));

      query.on('end', () => {
        client.end();
        resolve(results);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  static findAllForPerformance(performanceId) {
    const client = db.createClient();
    const sql = queries.resultsForPerformance;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', (resultRow) => results.push(instanceFromDBRow(resultRow)));

      query.on('end', () => {
        client.end();
        resolve(results);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  static findAllRawForPerformance(performanceId) {
    const client = db.createClient();
    const sql = 'SELECT * FROM results WHERE performanceId = $1';
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', reject);

      const query = client.query(sql, [performanceId]);

      query.on('row', (resultRow) => results.push(instanceFromDBRow(resultRow)));

      query.on('end', () => {
        client.end();
        resolve(results);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  static findAllForUser(nameNumber) {
    const client = db.createClient();
    const sql = queries.resultsForUser;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [nameNumber]);

      query.on('row', (resultRow) => {
        results.push(instanceFromDBRow(resultRow));
      });

      query.on('end', () => {
        client.end();
        resolve(results);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  static switchSpotsForPerformance(id) {
    const client = db.createClient();
    const resultsSql = queries.resultsForPerformance;
    const switchSql = 'SELECT switch_spots_based_on_results($1)';
    const oneUserSql = 'SELECT switch_spots_based_on_results_one_user($1)';
    const results = [];
    const onePersonResultIds = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => {
        logger.errorLog('Results.switchSpotsForPerformance', err);
        reject(err);
      });

      const resultsQuery = client.query(resultsSql, [id]);

      resultsQuery.on('row', resultRow => results.push(instanceFromDBRow(resultRow)));
      resultsQuery.on('end', () => {
        const filteredResults = results.filter(({ secondNameNumber }, i) => {
          if (!secondNameNumber) {
            onePersonResultIds.push(results[i].id);
          }
          return secondNameNumber;
        });
        const filteredResultsIds = filteredResults.sort(resultsSort).map(({ id: resultId }) => resultId);

        const switchQuery = client.query(switchSql, [filteredResultsIds]);

        switchQuery.on('end', () => {
          const oneUserQuery = client.query(oneUserSql, [onePersonResultIds]);

          oneUserQuery.on('end', () => {
            client.end();
            resolve();
          });
          oneUserQuery.on('error', err => {
            client.end();
            logger.errorLog('Results.switchSpotsForPerformance: oneUserQuery', err);
            reject(err);
          });
        });

        switchQuery.on('error', err => {
          client.end();
          logger.errorLog('Results.switchSpotsForPerformance: switchQuery', err);
          reject(err);
        });
      });

      resultsQuery.on('error', err => {
        logger.errorLog('Results.switchSpotsForPerformance', err);
        client.end();
        reject(err);
      });
    });
  }

  static update(attributes) {
    const client = db.createClient();

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const id = attributes.id;

      if (typeof id === 'undefined') {
        reject(new Error('No id provided with attributes'));
      }

      delete attributes.id;
      const { sql, values } = db.queryBuilder(Result, attributes, { statement: 'UPDATE', id });
      const query = client.query(sql, values);

      query.on('end', () => resolve());
      query.on('error', (err) => reject(err));
    });
  }

  static updateForTestsOnly(firstNameNumber, comments1, comments2, winnerId) {
    const client = db.createClient();
    const sql = 'UPDATE results SET firstComments = $1, secondComments = $2, winnerId = $3 WHERE firstNameNumber = $4';

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', reject);

      const query = client.query(sql, [comments1, comments2 || null, winnerId, firstNameNumber]);

      query.on('end', () => {
        client.end();
        resolve();
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
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

// id, fC, fNN, nA, opponentName, pending, perfDate, perfName, perfId, sC, sNN, spotId, winnerId
const instanceFromDBRow = ({
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
