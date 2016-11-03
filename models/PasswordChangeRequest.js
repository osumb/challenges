const crypto = require('crypto');
const { db } = require('../utils');

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
    const now = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    const id = crypto.createHash('sha1').update(now + random).digest('hex');

    return db.query(sql, [id, userNameNumber], ({ id: ID }) => ID);
  }

  static findById(id) {
    const sql = 'SELECT * FROM password_change_requests WHERE id = $1';

    return db.query(sql, [id], requestFromRow);
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
