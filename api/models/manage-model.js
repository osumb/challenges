const db = require('../../utils/db');

const modelAttributes = ['id', 'performance_id', 'user_name_number', 'reason', 'spot_id', 'voluntary'];

class Manage {
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

    return db.query(sql, [performanceId], instanceFromRowManage);
  }

  static findAllForUser(nameNumber) {
    const sql = `
      SELECT m.id AS id, p.name AS performance_name, m.user_name_number, m.reason, m.spot_id, m.voluntary
      FROM manage AS m JOIN performances AS p on m.performance_id = p.id
      WHERE m.user_name_number = $1
      ORDER BY id DESC
    `;

    return db.query(sql, [nameNumber], instanceFromRowPerformance);
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

const instanceFromRowPerformance = ({ id, performance_name, user_name_number, reason, voluntary, spot_id }) => (
  {
    id,
    performanceName: performance_name,
    userNameNumber: user_name_number,
    reason,
    spotId: spot_id,
    voluntary
  }
);

const instanceFromRowManage = ({ id, performance_id, name, name_number, reason, spot_id, voluntary }) =>
  new Manage(id, performance_id, name, name_number, reason, spot_id, voluntary);

module.exports = Manage;
