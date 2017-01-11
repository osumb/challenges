const bcrypt = require('bcrypt');

const db = require('../../utils/db');
const identityFunction = require('../../utils/identity-function');
const Model = require('./model');
const queries = require('../../db/queries');
const { snakeCase } = require('../../utils/object-keys-case-change');

const attributes = ['email', 'instrument', 'name', 'name_number', 'new', 'part', 'password', 'revoke_token_date', 'role', 'spot_id'];

class User extends Model {

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'name_number';
  }

  static get tableName() {
    return 'users';
  }

  static create(name, nN, instrument, part, role, spotId, email, password) {
    const sql = `
      INSERT INTO users
      (name, name_number, instrument, part, role, spot_id, email, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

    return db.query(sql, [name, nN, instrument, part, role, spotId, email, password]);
  }

  static canChallengeForPerformance(nameNumber, performanceId) {
    if (!performanceId) {
      return Promise.resolve(false);
    }
    const sql = queries.canChallengeForPerformance;

    return db.query(sql, [nameNumber, performanceId], ({ can_challenge }) => can_challenge).then(([can]) => can);
  }

  static findForIndividualManage(nameNumber) {
    const sql = queries.findForIndividualManage;

    return db.query(sql, [nameNumber], instanceFromRow);
  }

  static findByNameNumber(id) {
    const sql = 'SELECT * FROM users WHERE name_number = $1';

    return db.query(sql, [id], instanceFromRow).then(([user]) => user);
  }

  static indexMembers() {
    const sql = `
      SELECT * FROM users
      WHERE NOT spot_id IS NULL
      ORDER BY substring(spotId, 1, 1), substring(spotId, 2, 2)::int
    `;

    return db.query(sql, [], instanceFromRow);
  }

  static search(searchQuery) {
    const sql = 'SELECT * FROM users AS u, spots AS s WHERE lower(name) LIKE \'%\' || lower($1) || \'%\' and u.spot_id = s.id';

    return db.query(sql, [searchQuery], instanceFromRow);
  }

  static update(nameNumber, params) {
    let extraSql = '', parsingFunction = identityFunction;

    if (!nameNumber || typeof nameNumber !== 'string') {
      return Promise.reject(new Error('No nameNumber provided'));
    }

    if (params.password) {
      params.password = bcrypt.hashSync(params.password, bcrypt.genSaltSync(1)); // eslint-disable-line no-sync
      extraSql = 'RETURNING password';
      parsingFunction = ({ password }) => password;
    }

    const { sql, values } = db.queryBuilder(User, snakeCase(params), { statement: 'UPDATE', id: nameNumber });

    return db.query(`${sql} ${extraSql}`, values, parsingFunction);
  }

  static verifyEmail(email, nameNumber) {
    const sql = 'SELECT count(*) > 0 AS verified FROM users WHERE email = $1 and name_number = $2';

    return db.query(sql, [email, nameNumber], ({ verified }) => verified).then(([verified]) => {
      if (!verified) {
        throw new Error('Not Verified');
      }
    });
  }

  get admin() {
    return this._role === 'Admin' || this._role === 'Director';
  }

  get email() {
    return this._email;
  }

  get instrument() {
    return this._instrument;
  }

  get name() {
    return this._name;
  }

  get nameNumber() {
    return this._nameNumber;

  }

  get isNew() {
    return this._new;
  }

  get part() {
    return this._part;
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }

  get revokeTokenDate() {
    return this._revokeTokenDate;
  }

  get spotId() {
    return this._spotId;
  }

  get performanceId() {
    return this._performanceId;
  }

  get performanceName() {
    return this._performanceName;
  }

  get spotOpen() {
    return this._spotOpen;
  }

  get reason() {
    return this._reason;
  }

  get voluntary() {
    return this._voluntary;
  }

  toJSON() {
    return {
      admin: this._role === 'Admin' || this._role === 'Director',
      director: this._role === 'Director',
      email: this._email,
      instrument: this._instrument,
      name: this._name,
      nameNumber: this._nameNumber,
      new: this._new,
      part: this._part,
      password: this._password,
      revokeTokenDate: this._revokeTokenDate,
      spotId: this._spotId,
      spotOpen: this._spotOpen,
      squadLeader: this._role === 'Squad Leader'
    };
  }
}

const instanceFromRow = (props) => new User(props);

module.exports = User;
