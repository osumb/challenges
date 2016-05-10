'use strict';
const config = require('../config/config');
const models = require('../models');
const mockData = require('./mock-data');

models.sequelize.sync({force: true}).then(() => {
  models.Performance.create(config.test.mockPerformance[0]);
  models.Performance.create(config.test.mockPerformance[1]);
  models.Spot.bulkCreate(mockData.getSpotsFromExcelFile(config.db.fakeSpotDataPath))
    .then(() => {
      models.User.bulkCreate(mockData.getUsersFromExcelFile(config.db.fakeUserDataPath)).then(() => {
        models.Challenger.bulkCreate(mockData.getMockChallengesList()).then(() => {});
        models.Result.bulkCreate(mockData.getFakeResults()).then(() => {});
      });
    });
});
