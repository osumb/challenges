const bcrypt = require('bcrypt');

const queries = require('../db/queries');
const utils = require('../utils');

const attributes = ['nameNumber', 'instrument', 'name', 'part', 'password', 'role', 'spotId'];

class User {

  static getAttributes() {
    return attributes;
  }

  static getIdName() {
    return 'nameNumber';
  }

  static getTableName() {
    return 'users';
  }

  canChallengeForPerformance(user, performanceId) {
    return new Promise((resolve, reject) => {
      if (!performanceId) {
        resolve(false);
      }

      const client = utils.db.createClient();
      const sql = queries.canChallengeForPerformance;

      client.connect();
      client.on('error', reject);

      const query = client.query(sql, [user.nameNumber, performanceId, user.spotId]);

      // With this query, no rows means that the user can't challenge, so if the row event
      // Triggers, that means the user can challenge and we'll resolve true
      query.on('row', () => {
        client.end();
        resolve(true);
      });

      query.on('end', () => {
        client.end();
        resolve(false);
      });

      query.on('error', (err) => {
        reject(err);
        client.end();
      });
    });
  }

  changePassword(nameNumber, newPassword) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const sql = 'UPDATE users SET password = $1, new = false WHERE nameNumber = $2';
      const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(1)); // eslint-disable-line no-sync

      client.connect();
      client.on('error', reject);

      const query = client.query(sql, [password, nameNumber]);

      query.on('end', () => {
        client.end();
        resolve(password);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  findForIndividualManage(nameNumber) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const sql = queries.findForIndividualManage;
      const users = [];

      client.connect();
      client.on('error', reject);

      const query = client.query(sql, [nameNumber]);

      query.on('row', (user) => {
        users.push(this.parseForManage(user));
      });

      query.on('end', () => {
        client.end();
        resolve(users);
      });

      query.on('error', (err) => {
        reject(err);
        client.end();
      });
    });
  }

  findByNameNumber(nameNumber) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = `
        SELECT
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

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [nameNumber]);

      query.on('row', (result) => {
        client.end();
        resolve(result);
      });
      query.on('end', () => {
        client.end();
        resolve(null);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM users';
      const users = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString);

      query.on('row', (result) => {
        users.push(this.parse(result));
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

  parse(user) {
    return {
      admin: user.role === 'Admin' || user.role === 'Director',
      director: user.role === 'Director',
      instrument: user.instrument,
      name: user.name,
      nameNumber: user.namenumber,
      new: user.new,
      part: user.part,
      password: user.password,
      spotId: user.spotid,
      squadLeader: user.role === 'Squad Leader'
    };
  }

  parseForManage(user) {
    return {
      name: user.name,
      nameNumber: user.namenumber,
      performanceId: user.performanceid,
      performanceName: user.performancename,
      spotId: user.spotid,
      spotOpen: user.spotopen,
      reason: user.reason,
      voluntary: user.voluntary
    };
  }

  parseForSearch(user) {
    const partiallyParsed = this.parse(user);

    partiallyParsed.spotOpen = user.open;
    return partiallyParsed;
  }

  search(searchQuery) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM users AS u, spots AS s WHERE lower(name) LIKE \'%\' || lower($1) || \'%\' and u.spotId = s.id';
      const users = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [searchQuery]);

      query.on('row', (result) => {
        users.push(this.parseForSearch(result));
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
}

module.exports = User;
