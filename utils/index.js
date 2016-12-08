const auth = require('./auth');
const db = require('./db');
const identityFunction = require('./identity-function');
const logger = require('./logger');

module.exports = {
  auth,
  db,
  identityFunction,
  logger
};
