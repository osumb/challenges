const db = require('../../utils/db');

const attributes = ['id', 'expires', 'usernamenumber', 'used'];

class PasswordChangeRequest {

  constructor(id, expires, userNameNumber) {
    this._id = id;
    this._expires = expires;
    this._userNameNumber = userNameNumber;
  }

  static create(userNameNumber) {
    const sql = `
      INSERT INTO password_change_requests (id, expires, usernamenumber)
      VALUES($1, now() + INTERVAL '1 day', $2)
      RETURNING id
    `;
    const id = `${new Date().valueOf().toString()}${Math.random().toString()}`;

    return db.query(sql, [id, userNameNumber], ({ id: ID }) => ID);
  }

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'password_change_requests';
  }

  static findById(id) {
    const sql = 'SELECT * FROM password_change_requests WHERE id = $1';

    return db.query(sql, [id], requestFromRow);
  }

  static update(id, params) {
    const { sql, values } = db.queryBuilder(PasswordChangeRequest, params, { statement: 'UPDATE', id });

    return db.query(sql, values);
  }

  static verify(id, userNameNumber) {
    const sql = `
      SELECT count(*) > 0 AS verified
      FROM password_change_requests
      WHERE id = $1 AND usernamenumber = $2 AND now() < expires AND not used
    `;

    return db.query(sql, [id, userNameNumber], ({ verified }) => verified).then(([verified]) => {
      if (!verified) {
        throw new Error('Not Verified');
      }
    });
  }

  get id() {
    return this._id;
  }

  get expires() {
    return this._expires;
  }

  get userNameNumber() {
    return this._userNameNumber;
  }

  toJSON() {
    return {
      id: this._id,
      expires: this._expires,
      userNameNumber: this._userNameNumber
    };
  }
}

const requestFromRow = ({ id, expires, usernamenumber }) => {
  return new PasswordChangeRequest(id, expires, usernamenumber);
};

module.exports = PasswordChangeRequest;
