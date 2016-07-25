const queries = require('../db/queries');
const { db, logger } = require('../utils');

const modelAttributes = ['id', 'performanceId', 'spotId', 'firstNameNumber', 'secondNameNumber', 'firstComments', 'secondComments', 'winnerId', 'pending', 'needsApproval'];
const alternateVersusRegular = result =>
  (!result.useronealternate && result.usertwoalternate) ||
  (result.useronealternate && !result.usertwoalternate);
const alternateVersusAlternate = result =>
  result.useronealternate && result.usertwoalternate;
const regularVersusRegular = result =>
  !result.useronealternate && !result.usertwoalternate;

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

module.exports = class Results {

  static getAttributes() {
    return modelAttributes;
  }

  static getIdName() {
    return 'id';
  }

  static getTableName() {
    return 'results';
  }

  approve(ids) {
    const client = db.createClient();
    const sql = 'UPDATE results SET needsApproval = FALSE WHERE id = ANY($1)';

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [ids]);

      query.on('end', () => {
        client.end();
        resolve();
      });
      query.on('error', (err) => {
        reject(err);
        client.end();
      });
    });
  }

  checkAllDoneForPerformance(id) {
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

  createWithClient(attributes, client) {
    const { sql, values } = db.queryBuilder(Results, attributes);

    return new Promise((resolve, reject) => {
      const query = client.query(sql, values);

      query.on('end', resolve);
      query.on('error', reject);
    });
  }

  findAllForApproval() {
    const client = db.createClient();
    const sql = queries.resultsForApproval;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql);

      query.on('row', (result) => results.push(this.parseForAdmin(result)));
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

  findAllForEval(instrument, part, performanceId, userNameNumber) {
    const client = db.createClient();
    const sql = queries.resultsForEval;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [instrument, part, performanceId, userNameNumber]);

      query.on('row', (result) => results.push(this.parseForEval(result)));

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

  findAllForPerformance(performanceId) {
    const client = db.createClient();
    const sql = queries.resultsForPerformance;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', (result) => results.push(this.parseForAdmin(result)));

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

  findAllForUser(nameNumber) {
    const client = db.createClient();
    const sql = queries.resultsForUser;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [nameNumber]);

      query.on('row', (result) => {
        results.push(this.parse(result, nameNumber));
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

  switchSpotsForPerformance(id) {
    const client = db.createClient();
    const resultsSql = queries.resultsForPerformance;
    const switchSql = 'SELECT switch_spots_based_on_results($1)';
    const oneUserSql = 'SELECT switch_spots_based_on_results_one_user($1)';
    const results = [];
    const onePersonResultIds = [];

    client.connect();
    client.on('error', (err) => {
      logger.errorLog({ level: 3, message: `Results.switchSpotsForPerformance ${err}` });
    });

    const resultsQuery = client.query(resultsSql, [id]);

    resultsQuery.on('row', result => results.push(result));
    resultsQuery.on('end', () => {
      const filteredResults = results.filter(({ namenumbertwo }, i) => {
        if (!namenumbertwo) {
          onePersonResultIds.push(results[i].resultsid);
        }
        return namenumbertwo;
      });
      const filteredResultsIds = filteredResults.sort(resultsSort).map(({ resultsid }) => resultsid);

      const switchQuery = client.query(switchSql, [filteredResultsIds]);

      switchQuery.on('end', () => {
        const oneUserQuery = client.query(oneUserSql, [onePersonResultIds]);

        oneUserQuery.on('end', () => client.end());
        oneUserQuery.on('error', err => {
          client.end();
          logger.errorLog({ level: 3, message: `Results.switchSpotsForPerformance: oneUserQuery ${err}` });
        });
      });

      switchQuery.on('error', err => {
        client.end();
        logger.errorLog({ level: 3, message: `Results.switchSpotsForPerformance: switchQuery ${err}` });
      });
    });

    resultsQuery.on('error', err => {
      logger.errorLog({ level: 3, message: `Results.switchSpotsForPerformance: ${err}` });
      client.end();
    });
  }

  update(attributes) {
    const client = db.createClient();

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const id = attributes.id;

      if (typeof id === 'undefined') {
        reject(new Error('No id provided with attributes'));
      }

      delete attributes.id;
      const { sql, values } = db.queryBuilder(Results, attributes, { statement: 'UPDATE', id });
      const query = client.query(sql, values);

      query.on('end', () => resolve());
      query.on('error', (err) => reject(err));
    });
  }

  parse(result, nameNumber) {
    return {
      comments: result.comments,
      opponentName: result.opponentname,
      performanceName: result.name,
      spotId: result.spotid,
      winner: nameNumber === result.winnerid
    };
  }

  parseForAdmin(result) {
    return {
      id: result.resultid,
      firstComments: result.firstcomments,
      firstName: result.nameone,
      pending: result.pending,
      performanceId: result.performanceid,
      performanceName: result.performancename,
      secondComments: result.secondcomments,
      secondName: result.nametwo,
      spotId: result.spotid,
      winner: result.winnerid === result.namenumberone ? result.nameone : result.nametwo
    };
  }

  parseForEval(result) {
    return {
      firstName: result.nameone,
      firstNameNumber: result.firstnamenumber,
      resultId: result.resultid,
      secondName: result.nametwo,
      secondNameNumber: result.secondnamenumber,
      spotId: result.spotid
    };
  }
};
