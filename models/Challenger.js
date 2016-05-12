'use strict';
const options = {freezeTableName: true};
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Challengers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, options);
};
