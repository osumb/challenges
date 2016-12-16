const changeCase = require('change-case');

class Model {

  constructor(props) {
    Object.keys(props).forEach((propKey) => {
      this[`_${changeCase.camelCase(propKey)}`] = props[propKey];
    });
  }
}

module.exports = Model;
