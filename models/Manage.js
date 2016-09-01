const { db } = require('../utils');

const modelAttributes = ['id', 'performanceId', 'userNameNumber', 'reason', 'spotId', 'voluntary'];

module.exports = class Manage {
  constructor(id, performanceId, userName, userNameNumber, reason, spotId, voluntary) {
    this._id = id;
    this._performanceId = performanceId;
    this._userName = userName;
    this._userNameNumber = userNameNumber;
    this._reason = reason;
    this._spotId = spotId;
    this._voluntary = voluntary;
  }

  static get attributes() {
    return modelAttributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'manage';
  }

  static create(attributes) {
    return new Promise((resolve, reject) => {
      const client = db.createClient();
      const { sql, values } = db.queryBuilder(Manage, attributes);

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, values);

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

  static findAllForPerformanceCSV(performanceId) {
    return new Promise((resolve, reject) => {
      const client = db.createClient();
      const sql = `
        SELECT *
        FROM manage AS m JOIN users AS u ON m.usernamenumber = u.namenumber
        WHERE m.performanceId = $1
        ORDER BY (substring(u.spotid, 0, 2), substring(u.spotid, 2)::int)
      `;
      const actions = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', ({ id, performanceid, name, namenumber, reason, spotid, voluntary }) => {
        actions.push(new Manage(id, performanceid, name, namenumber, reason, spotid, voluntary));
      });

      query.on('end', () => {
        client.end();
        resolve(actions);
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

  get performanceId() {
    return this._performanceId;
  }

  get userName() {
    return this._userName;
  }

  get userNameNumber() {
    return this._userNameNumber;
  }

  get reason() {
    return this._reason;
  }

  get spotId() {
    return this._spotId;
  }

  get voluntary() {
    return this._voluntary;
  }

};
