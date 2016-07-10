const utils = require('../utils');

const attributes = ['nameNumber', 'spotId', 'name', 'password', 'instrument', 'part', 'eligible', 'squadLeader', 'admin', 'alternate'];

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

  findByNameNumber(nameNumber) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM users WHERE nameNumber = $1;';

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

  makeIneligible(nameNumber) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'UPDATE users SET eligible = false WHERE nameNumber = $1';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [nameNumber]);

      query.on('end', () => {
        client.end();
        resolve();
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  parse(user) {
    return {
      admin: user.admin,
      eligible: user.eligible,
      instrument: user.instrument,
      name: user.name,
      nameNumber: user.namenumber,
      part: user.part,
      spotId: user.spotid,
      squadLeader: user.squadleader
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
