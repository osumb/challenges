const pg = require('pg');
const Pool = require('pg-pool');
const url = require('url');

const dbURL = require('../db/url');
const config = require('../config');
const identityFunction = require('./identity-function');

const postgresParams = url.parse(dbURL);

const auth = postgresParams.auth && postgresParams.auth.split(':');
const poolConfig = {
  user: auth && auth[0],
  password: auth && auth[1],
  host: postgresParams.hostname,
  port: postgresParams.port,
  database: postgresParams.pathname.split('/')[1],
  ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
};

const pool = new Pool(poolConfig);

const createClient = () => new pg.Client(dbURL);

const query = (sql, params, parseRow = identityFunction) =>
  pool.query(sql, params)
  .then((data) => (data.rows || []).map((row) => parseRow(row)))
  .catch((err) => {
    throw err;
  });

const queryBuilder = (model, params, options) => {
  const attributes = model.attributes, tableName = model.tableName, idName = model.idName;

  options = options || {}; // eslint-disable-line no-param-reassign
  try {

    /* eslint-disable indent */
    switch (options.statement) {
      case 'UPDATE':
        if (typeof options.id === 'undefined') {
          throw new Error('Must supply id with UPDATE option');
        }

        const values = buildValues(params);

        values.push(options.id);
        return {
          sql: buildUpdateQuery(tableName, idName, attributes, params),
          values
        };

      default:
        return {
          sql: buildInsertQuery(tableName, attributes, params),
          values: buildValues(params)
        };
    }

    /* eslint-enable indent */
  } catch (e) {
    throw (e);
  }
};

function buildValues(params) {
  const values = [];

  Object.keys(params).forEach((key) =>
    values.push(params[key])
  );
  return values;
}

function buildInsertQuery(tableName, attributes, params) {
  let attributesString = '', paramsString = '';

  try {
    attributesString = buildInsertAttributesString(params, attributes);
    paramsString = buildInsertParamsString(Object.keys(params).length);
    return `INSERT INTO ${tableName} ${attributesString} ${paramsString}`;
  } catch (e) {
    throw e;
  }
}

function buildInsertAttributesString(params, attributes) {
  const str = Object.keys(params).reduce((prev, current, index) => {
    if (attributes.includes(current)) {
      return index === 0 ? `${prev}${current}` : `${prev}, ${current}`;
    }
    throw new Error(`Attribute ${current} doesn't exist for Result model`);
  }, '(');

  return `${str})`;
}

function buildInsertParamsString(length) {
  let paramsString = 'VALUES(';

  for (let i = 1; i <= length; i++) {
    paramsString = i === 1 ? `${paramsString}$${i}` : `${paramsString}, $${i}`;
  }

  return `${paramsString})`;
}

function buildUpdateQuery(tableName, idName, attributes, params) {
  try {
    const updateString = buildUpdateString(attributes, params, tableName);

    return `UPDATE ${tableName} SET ${updateString} WHERE ${idName} = $${Object.keys(params).length + 1}`;
  } catch (e) {
    throw (e);
  }
}

function buildUpdateString(attributes, params, tableName = '') {
  return Object.keys(params).reduce((prev, curr, i) => {
    if (attributes.includes(curr)) {
      return i === 0 ? `${curr} = $${i + 1}` : `${prev}, ${curr} = $${i + 1}`;
    }
    throw new Error(`Attribute ${curr} doesn't exist for ${tableName} model`);
  }, '');
}

module.exports = {
  createClient,
  query,
  queryBuilder
};
