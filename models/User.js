const utils = require('../utils');

class User {
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
      const queryString = 'SELECT * FROM "Users"';
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
}

module.exports = User;
