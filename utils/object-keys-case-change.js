const changeCase = require('change-case');

const camelCase = (object) => Object.keys(object).reduce((acc, curr) => {
  acc[changeCase.camelCase(curr)] = object[curr];

  return acc;
}, {});

const snakeCase = (object) => Object.keys(object).reduce((acc, curr) => {
  acc[changeCase.snakeCase(curr)] = object[curr];

  return acc;
}, {});

module.exports = {
  camelCase,
  snakeCase
};