const bcrypt = require('bcrypt');

const queries = require('../db/queries');
const { db } = require('../utils');

const attributes = ['nameNumber', 'instrument', 'name', 'part', 'password', 'role', 'spotId'];

class User {

  constructor(email, instrument, name, nameNumber, isNew, part, password, role, spotId, spotOpen = false) {
    this._admin = role === 'Admin' || role === 'Director';
    this._director = role === 'Director';
    this._email = email;
    this._instrument = instrument;
    this._name = name;
    this._nameNumber = nameNumber;
    this._new = isNew;
    this._part = part;
    this._password = password;
    this._spotId = spotId;
    this._spotOpen = spotOpen;
    this._squadLeader = role === 'Squad Leader';
  }

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'nameNumber';
  }

  static get tableName() {
    return 'users';
  }

  static create(name, nN, instrument, part, role, spotId, email, password) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users
        (name, namenumber, instrument, part, role, spotId, email, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

      db.query(sql, [name, nN, instrument, part, role, spotId, email, password])
      .then(resolve)
      .catch(reject);
    });
  }

  static canChallengeForPerformance(user, performanceId) {
    return new Promise((resolve, reject) => {
      if (!performanceId) {
        resolve(false);
      }
      const sql = queries.canChallengeForPerformance;

      db.query(sql, [user.nameNumber, performanceId, user.spotId])
      .then(resolve)
      .catch(reject);
    });
  }

  static changePassword(nameNumber, newPassword) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE users SET password = $1, new = false WHERE nameNumber = $2';
      const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(1)); // eslint-disable-line no-sync

      db.query(sql, [password, nameNumber])
      .then(resolve)
      .catch(reject);
    });
  }

  static findForIndividualManage(nameNumber) {
    return new Promise((resolve, reject) => {
      const sql = queries.findForIndividualManage;

      db.query(sql, [nameNumber], instanceFromRowUserIndividualManage)
      .then(resolve)
      .catch(reject);
    });
  }

  static findByNameNumber(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          email,
          name,
          namenumber,
          new,
          COALESCE(u.instrument, ra.instrument) AS instrument,
          COALESCE(u.part, ra.part) AS part,
          password,
          role,
          spotid
        FROM users AS u LEFT OUTER JOIN results_approve AS ra ON u.nameNumber = ra.usernamenumber
        WHERE nameNumber = $1
      `;

      db.query(sql, [id], instanceFromRowUser)
      .then((user) => resolve(user[0] || null))
      .catch(reject);
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users';

      db.query(sql, [], instanceFromRowUser)
      .then(resolve)
      .catch(reject);
    });
  }

  static search(searchQuery) {
    return new Promise((resolve, reject) => {
      const client = db.createClient();
      const queryString = 'SELECT * FROM users AS u, spots AS s WHERE lower(name) LIKE \'%\' || lower($1) || \'%\' and u.spotId = s.id';
      const users = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [searchQuery]);

      query.on('row', ({ email, instrument, name, namenumber, new: isNew, part, password, role, spotid, open: spotOpen }) => {
        users.push(new User(email, instrument, name, namenumber, isNew, part, password, role, spotid, spotOpen));
      });

      query.on('end', () => {
        client.end();
        resolve(users);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
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

  get spotId() {
    return this._spotId;
  }

  toJSON() {
    return {
      admin: this._admin,
      director: this._director,
      email: this._email,
      instrument: this._instrument,
      name: this._name,
      nameNumber: this._nameNumber,
      new: this._new,
      part: this._part,
      password: this._password,
      spotId: this._spotId,
      spotOpen: this._spotOpen,
      squadLeader: this._squadLeader
    };
  }
}

class UserForIndividualManage {

  constructor(name, nameNumber, performanceId, performanceName, spotId, spotOpen, reason, voluntary) {
    this._name = name;
    this._nameNumber = nameNumber;
    this._performanceId = performanceId;
    this._performanceName = performanceName;
    this._spotId = spotId;
    this._spotOpen = spotOpen;
    this._reason = reason;
    this._voluntary = voluntary;
  }

  get name() {
    return this._name;
  }

  get nameNumber() {
    return this._nameNumber;

  }

  get performanceId() {
    return this._performanceId;
  }

  get performanceName() {
    return this._performanceName;
  }

  get spotId() {
    return this._spotId;
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

}

const instanceFromRowUser = ({ email, instrument, name, namenumber, new: isNew, part, password, role, spotid }) =>
  new User(email, instrument, name, namenumber, isNew, part, password, role, spotid);

const instanceFromRowUserIndividualManage = ({ name, namenumber, performanceid, performancename, spotid, spotopen, reason, voluntary }) =>
  new UserForIndividualManage(name, namenumber, performanceid, performancename, spotid, spotopen, reason, voluntary);

module.exports = User;
