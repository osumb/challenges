const utils = require('../utils');

const attributes = ['id', 'open', 'challengedCount'];

module.exports = class Spot {

  constructor(id, open, challengedCount) {
    this._id = id;
    this._open = open;
    this._challengedCount = challengedCount;
  }

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'spots';
  }

  // true is open, false is closed
  static setOpenClose(spotId, open) {
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

  get id() {
    return this._id;
  }

  get challengedCount() {
    return this._challengedCount;
  }

  get open() {
    return this._open;
  }
};
