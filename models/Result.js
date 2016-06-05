const queries = require('../db/queries');
const utils = require('../utils');

module.exports = class Results {
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
};
