'use strict';
const options = {freezeTableName: true};
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Results', {
    'winnerId': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    'comments1': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    'comments2': {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    'pending': {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, options);
};
