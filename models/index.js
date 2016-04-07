'use strict';
const Sequelize = require('sequelize');
const config = require('../config/config');
const sequelize = new Sequelize(config.db.postgres, {logging: false});
const db = {};

//Models
db.User = sequelize.import(__dirname + '/User');
db.Performance = sequelize.import(__dirname + '/Performance');
db.Challenge = sequelize.import(__dirname + '/Challenge');
db.Challenger = sequelize.import(__dirname + '/Challenger');
db.Challengee = sequelize.import(__dirname + '/Challengee');

//Relations
db.Performance.hasMany(db.Challenge);
db.Challenger.belongsTo(db.User);
db.Challengee.belongsTo(db.User);
db.Challenge.hasOne(db.Challengee);
db.Challenge.hasMany(db.Challenger);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
