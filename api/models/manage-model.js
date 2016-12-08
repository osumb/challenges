const db = require('../../utils');

const modelAttributes = ['id', 'performanceId', 'userNameNumber', 'reason', 'spotId', 'voluntary'];

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
      FROM manage AS m JOIN users AS u ON m.usernamenumber = u.namenumber
      WHERE m.performanceId = $1
      ORDER BY (substring(u.spotid, 0, 2), substring(u.spotid, 2)::int)
    `;

    return db.query(sql, [performanceId], instanceFromRowManage);
  }

  static findAllForUser(nameNumber) {
    const sql = `
      SELECT m.id AS id, p.name AS performanceName, m.usernamenumber, m.reason, m.spotid, m.voluntary
      FROM manage AS m JOIN performances AS p on m.performanceid = p.id
      WHERE m.usernamenumber = $1
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

const instanceFromRowPerformance = ({ id, performancename, usernamenumber, reason, voluntary, spotid }) => (
  {
    id,
    performanceName: performancename,
    userNameNumber: usernamenumber,
    reason,
    spotId: spotid,
    voluntary
  }
);

const instanceFromRowManage = ({ id, performanceid, name, namenumber, reason, spotid, voluntary }) =>
  new Manage(id, performanceid, name, namenumber, reason, spotid, voluntary);

module.exports = Manage;
