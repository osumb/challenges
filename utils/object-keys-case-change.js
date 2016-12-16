const changeCase = require('change-case');

const snakeCase = (object) => Object.keys(object).reduce((acc, curr) => {
  acc[changeCase.snakeCase(curr)] = object[curr];

  return acc;
}, {});

module.exports = {
  snakeCase
};
