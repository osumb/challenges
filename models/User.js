const utils = require('../utils');

function parseUserFromDB(user) {
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;

  return user;
}

class User {
  findByNameNumber(nameNumber) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM "Users" WHERE "nameNumber" = $1;';

      client.connect();
      client.on('error', (err) => {reject(err);});

      const query = client.query(queryString, [nameNumber]);
      query.on('row', (result) => {
        client.end();
        resolve(parseUserFromDB(result));
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
      client.on('error', (err) => {reject(err);});

      const query = client.query(queryString);
      query.on('row', (result) => {
        users.push(parseUserFromDB(result));
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
