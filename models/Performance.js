const Sequelize = require('sequelize');
const config = require('../config');
const sql = new Sequelize(config.db.postgres, {logging: false});
const dataTypes = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  openAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  closeAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const options = {freezeTableName: true};

module.exports = sql.define('performance', dataTypes, options);
