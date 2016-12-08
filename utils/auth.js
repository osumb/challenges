/* eslint-disable callback-return, no-unused-expressions */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const config = require('../config');
const logger = require('./logger');
const User = require('../api/models/user-model');

const ensureAdmin = ({ user }, res, next) => {
  user.admin ? next() : res.status(404).send();
};

const ensureAdminOrSquadLeader = ({ user }, res, next) => (user && user.admin || user.squadLeader) ? next() : res.status(404).send();

const ensureAuthenticated = ({ user }, res, next) => (user && user !== {}) ? next() : res.status(404).send();

const ensureResultsIndexAbility = ({ user }, res, next) => {
  (user.admin && user.instrument === 'Any' && user.instrument === 'Any') ?
    next() :
    res.status(404).send();
};

const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const getTokenForUser = ({ body }, res, next) => {
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
};

const getUserFromToken = (token) => {
  return token && jwtDecode(token);
};

const refreshToken = (user) => tokenFromUser(user);

const tokenFromUser = (user) => {
  delete user.password;
  delete user.spotId;

  const now = new Date();

  now.setDate(now.getDate() + 7);
  user.expires = now.getTime();

  return jwt.sign(Object.assign({}, user, { iat: new Date().getTime() }), config.auth.secret);
};

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    if (!token) {
      return resolve(false);
    }
    return jwt.verify(token, config.auth.secret, (err, verified) => {
      if (err) return reject(err);

      const user = getUserFromToken(token);
      const now = new Date().getTime();

      if (user.expires < now) {
        resolve(false);
      }

      return User.findByNameNumber(user.nameNumber)
      .then((dbUser) => {
        if (user.iat < new Date(dbUser.revokeTokenDate).getTime()) {
          return resolve(false);
        }
        return resolve(verified);
      });
    });
  });

module.exports = {
  ensureAdmin,
  ensureAdminOrSquadLeader,
  ensureAuthenticated,
  ensureResultsIndexAbility,
  getToken,
  getTokenForUser,
  getUserFromToken,
  refreshToken,
  tokenFromUser,
  verifyToken
};
