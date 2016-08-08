const { db } = require('../utils');

const modelAttributes = ['id', 'performanceId', 'userNameNumber', 'reason', 'voluntary'];

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

      console.log(sql, values);
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
};
