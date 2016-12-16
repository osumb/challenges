const db = require('../../utils/db');
const Model = require('./model');

const modelAttributes = ['id', 'performance_id', 'user_name_number', 'reason', 'spot_id', 'voluntary'];

class Manage extends Model {

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
    const { sql, values } = db.queryBuilder(Manage, attributes);

    return db.query(sql, values);
  }

  static findAllForPerformanceCSV(performanceId) {
    const sql = `
      SELECT *
      FROM manage AS m JOIN users AS u ON m.user_name_number = u.name_number
      WHERE m.performance_id = $1
      ORDER BY (substring(u.spot_id, 0, 2), substring(u.spot_id, 2)::int)
    `;

    return db.query(sql, [performanceId], instanceFromRow);
  }

  static findAllForUser(nameNumber) {
    const sql = `
      SELECT m.id AS id, p.name AS performance_name, m.user_name_number, m.reason, m.spot_id, m.voluntary
      FROM manage AS m JOIN performances AS p on m.performance_id = p.id
      WHERE m.user_name_number = $1
      ORDER BY id DESC
    `;

    return db.query(sql, [nameNumber], instanceFromRow);
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

  toJSON() {
    return {
      id: this._id,
      performanceId: this._performanceId,
      userName: this._userName,
      userNameNumber: this._userNameNumber,
      reason: this._reason,
      spotId: this._spotId,
      voluntary: this._voluntary
    };
  }
}

const instanceFromRow = (props) => new Manage(props);

module.exports = Manage;
