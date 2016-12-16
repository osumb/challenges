const db = require('../../utils/db');
const Model = require('./model');

const attributes = ['id', 'open', 'challenged_count'];

class Spot extends Model {

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'spots';
  }

  static create(id) {
    const sql = 'INSERT INTO spots (id) VALUES($1)';

    return db.query(sql, [id]);
  }

  static findByOwnerNameNumber(nameNumber) {
    const sql = `
      SELECT s.challenged_count, s.id, s.open
      FROM spots AS s JOIN users AS u ON u.spot_id = s.id
      WHERE u.name_number = $1
    `;

    return db.query(sql, [nameNumber], instanceFromDBRow);
  }

  // true is open, false is closed
  static setOpenClose(spotId, open) {
    const sql = 'UPDATE spots SET open = $1 WHERE id = $2';

    return db.query(sql, [open, spotId]);
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

  toJSON() {
    return {
      challengedCount: this._challengedCount,
      id: this._id,
      open: this._open
    };
  }
}

const instanceFromDBRow = (props) => new Spot(props);

module.exports = Spot;
