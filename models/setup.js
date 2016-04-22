'use strict';
const config = require('../config/config');
const models = require('../models');
const mockData = require('./mock-data');

models.sequelize.sync({force: true}).then(() => {
  models.Performance.create(config.test.mockPerformance);
  models.Spot.bulkCreate(mockData.getSpotsFromExcelFile(config.db.fakeSpotDataPath))
    .then(() => {
      console.log('Added Spots');
      models.User.bulkCreate(mockData.getUsersFromExcelFile(config.db.fakeUserDataPath)).then(() => {console.log('Added fake data');});
    });
});
