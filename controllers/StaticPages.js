'use strict';
const Performance = require('../models').Performance;
const moment = require('moment');
const nextPerformanceQuery = {
  where: {
    openAt: {
      $gt: new Date()
    }
  },
  order: [['openAt', 'ASC']],
  limit: 1
};

function StaticPagesController() {
  this.home = function(req, res) {
    const performance = Performance.findAll(nextPerformanceQuery);
    performance.then((data) => {
      //we're doing find all with a limit 1, so it's coming back as an array of length 1
      const dataValues = data[0].dataValues;
      let renderData = createPerformanceObj(dataValues);
      res.render('index', renderData);
    });

    performance.catch(() => {
      res.render('error');
    });

    return performance;
  };

  this.noAuth = function(req, res) {
    res.render('noAuth');
  };
}

function createPerformanceObj(dataValues) {
  let renderData = {};
  if (dataValues) {
    renderData.performanceName = dataValues.name;
    renderData.openAt = moment(dataValues.openAt).format();
    renderData.closeAt = moment(dataValues.closeAt).format();
  }
  return renderData;
}
module.exports = StaticPagesController;
