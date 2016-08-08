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

  close(spotId) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'UPDATE spots SET open = false WHERE id = $1';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [spotId]);

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

  open(spotId) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'UPDATE spots SET open = true WHERE id = $1';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [spotId]);

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
