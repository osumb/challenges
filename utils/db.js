const pg = require('pg');

const config = require('../config/config.js');

const createClient = () =>
  new pg.Client(config.db.postgres);

module.exports = {
  createClient: createClient
};
