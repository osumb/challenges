'use strict';
const config = require('../config/config');
const models = require('../models');
const mockData = require('./mock-data');

models.sequelize.sync({force: true}).then(() => {
  models.Performance.create({name: 'Bowling Green Game', openAt: new Date(2016, 2, 23, 13), closeAt: new Date(2016, 2, 23, 15)});
  models.Spot.bulkCreate(mockData.getSpotsFromExcelFile(config.db.fakeUserDataPath))
    .then(() => {
      console.log('Added Spots');
      models.User.bulkCreate(mockData.getUsersFromExcelFile(config.db.fakeUserDataPath)).then(() => {console.log('Added fake data');});
    });
});
