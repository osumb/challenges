/* eslint-disable callback-return, no-unused-expressions */
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const config = require('../config');

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

const getUserFromToken = (token) => {
  return token && jwtDecode(token);
};

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    if (!token) {
      resolve(false);
    }
    jwt.verify(token, config.auth.secret, (err, verified) => {
      if (err) reject(err);
      resolve(verified);
    });
  });

module.exports = {
  ensureAdmin,
  ensureAdminOrSquadLeader,
  ensureAuthenticated,
  ensureResultsIndexAbility,
  getToken,
  getUserFromToken,
  verifyToken
};
