const { db } = require('../utils');

const modelAttributes = ['id', 'performanceId', 'userNameNumber', 'reason', 'spotId', 'voluntary'];

module.exports = class Manage {
  static getAttributes() {
    return modelAttributes;
  }

  static getIdName() {
    return 'id';
  }

  static getTableName() {
    return 'manage';
  }

  create(attributes) {
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

  findAllForPerformanceCSV(performanceId) {
    return new Promise((resolve, reject) => {
      const client = db.createClient();
      const sql = `
        SELECT u.name, u.spotid, m.reason
        FROM manage AS m JOIN users AS u ON m.usernamenumber = u.namenumber
        WHERE m.performanceId = $1
        ORDER BY (substring(u.spotid, 0, 2), substring(u.spotid, 2)::int)
      `;
      const actions = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(sql, [performanceId]);

      query.on('row', (action) => {
        actions.push(action);
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

};
