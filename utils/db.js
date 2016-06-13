const pg = require('pg');

const config = require('../config');

const createClient = () =>
  new pg.Client(config.db.postgres);

const queryBuilder = (model, params, options) => {
  const attributes = model.getAttributes(), tableName = model.getTableName(), idName = model.getIdName();

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
  queryBuilder
};
