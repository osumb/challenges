const queries = require('../db/queries');
const { db } = require('../utils');

const modelAttributes = ['id', 'performanceId', 'spotId', 'firstNameNumber', 'secondNameNumber', 'firstComments', 'secondComments', 'winnerId', 'pending', 'needsApproval'];

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

  findAllForApproval(performanceId) {
    const client = db.createClient();
    const sql = queries.resultsForApproval;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', (result) => {
        console.log(result);
        results.push(this.parseForAdmin(result));
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
    console.log(result.namenumberone, result.namenumbertwo, result.winnerid);
    return {
      firstComments: result.firstcomments,
      secondComments: result.secondcomments,
      firstName: result.nameone,
      pending: result.pending,
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
