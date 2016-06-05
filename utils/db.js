const pg = require('pg');

const config = require('../config');

const createClient = () =>
  new pg.Client(config.db.postgres);

module.exports = {
  createClient
};
