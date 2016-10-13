const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { auth } = require('../config');
const { logger } = require('../utils');
const { User } = require('../models');

class Auth {
  static getToken({ query }, res) {
    const { nameNumber, password } = query;

    User.findByNameNumber(nameNumber)
      .then((user) => {
        if (!user) {
          res.status(404).send();
        }
        if (!bcrypt.compareSync(password, user.password)) { // eslint-disable-line no-sync
          res.status(404);
        }

        const userJSON = user.toJSON();

        delete userJSON.password;

        const token = jwt.sign(userJSON, auth.secret);

        res.json({ token });
      })
      .catch((err) => {
        logger.errorLog('Auth.getToken', err);
        res.status(500);
      });
  }
}

module.exports = Auth;
