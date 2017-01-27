const db = require('../../utils/db');
const Model = require('./model');
const { snakeCase } = require('../../utils/object-keys-case-change');

const attributes = ['id', 'expires', 'user_name_number', 'used'];

class PasswordChangeRequest extends Model {

  static create(userNameNumber) {
    const sql = `
      INSERT INTO password_change_requests (id, expires, user_name_number)
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

    return db.query(sql, [id], instanceFromRow).then(([request]) => request);
  }

  static update(id, params) {
    const { sql, values } = db.queryBuilder(PasswordChangeRequest, snakeCase(params), { statement: 'UPDATE', id });

    return db.query(sql, values);
  }

  static verify(id, userNameNumber) {
    const sql = `
      SELECT count(*) > 0 AS verified
      FROM password_change_requests
      WHERE id = $1 AND user_name_number = $2 AND now() < expires AND not used
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

  get used() {
    return this._used;
  }

  get userNameNumber() {
    return this._userNameNumber;
  }

  toJSON() {
    return {
      id: this._id,
      expires: this._expires,
      userNameNumber: this._userNameNumber,
      used: this._used
    };
  }
}

const instanceFromRow = (props) => new PasswordChangeRequest(props);

module.exports = PasswordChangeRequest;
