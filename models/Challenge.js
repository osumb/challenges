'use strict';
const options = {freezeTableName: true};

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Challenges', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    winner: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, options);
};
