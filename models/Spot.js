const utils = require('../utils');

const attributes = ['id', 'open', 'challengedCount'];

module.exports = class Spot {
  static getAttributes() {
    return attributes;
  }

  static getIdName() {
    return 'id';
  }

  static getTableName() {
    return 'spots';
  }

  // true is open, false is closed
  setOpenClose(spotId, open) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'UPDATE spots SET open = $1 WHERE id = $2';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [open, spotId]);

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
};
