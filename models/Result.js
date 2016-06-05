const queries = require('../db/queries');
const utils = require('../utils');

module.exports = class Results {
  findAllForEval(instrument, part, performanceId) {
    const client = utils.db.createClient();
    const sql = queries.resultsForEval;
    const results = [];

    return new Promise((resolve, reject) => {
      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [instrument, part, performanceId]);

      query.on('row', (result) => results.push(this.parseForEval(result)));

      query.on('end', (result) => {
        console.log(result.command);
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
    const client = utils.db.createClient();
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
    const client = utils.db.createClient();
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
      firstComments: result.firstcomments,
      secondComments: result.secondcomments,
      firstName: result.nameone,
      pending: result.pending,
      secondName: result.nametwo,
      spotId: result.spotid,
      winner: result.winner === result.namenumberone ? result.nameone : result.nametwo
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
