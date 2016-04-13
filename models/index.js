'use strict';
const Sequelize = require('sequelize');
const config = require('../config/config');
const sequelize = new Sequelize(config.db.postgres, {logging: false});
const db = {};

//Models
db.User = sequelize.import(__dirname + '/User');
db.Performance = sequelize.import(__dirname + '/Performance');
db.Challenger = sequelize.import(__dirname + '/Challenger');
db.Result = sequelize.import(__dirname + '/Result');
db.Spot = sequelize.import(__dirname + '/Spot');

//Relations
db.Performance.hasMany(db.Challenger);
db.Performance.hasMany(db.Result);
db.User.belongsTo(db.Spot);
db.User.hasMany(db.Challenger);
db.Challenger.belongsTo(db.Spot);
db.Result.belongsTo(db.Spot);
db.Result.belongsTo(db.User, {as: 'first'});
db.Result.belongsTo(db.User, {as: 'second'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
