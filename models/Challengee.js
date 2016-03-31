'use strict';
const options = {freezeTableName: true};
module.exports = (sequelize) => {
  return sequelize.define('Challengees', {}, options);
};
