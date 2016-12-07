const bcrypt = require('bcrypt');

const { tokenFromUser } = require('../../auth');
const { logger } = require('../../utils');
const { User } = require('../models');

class Auth {
  static getToken({ body }, res, next) {
    const { nameNumber, password } = body;

    User.findByNameNumber(nameNumber)
      .then((user) => {
        if (!user) {
          res.status(404).send();
          return;
        }
        if (!bcrypt.compareSync(password, user.password)) { // eslint-disable-line no-sync
          res.status(404).send();
          return;
        }
        res.locals.jsonResp = { token: tokenFromUser(user.toJSON()) };
        next();
      })
      .catch((err) => {
        logger.errorLog('Auth.getToken', err);
        res.status(500).send();
      });
  }
}

module.exports = Auth;
