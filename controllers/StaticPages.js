'use strict';
const Performance = require('../models').Performance;
const nextPerformanceQuery = {
  where: {
    openAt: {
      $gt: Date.now()
    }
  },
  order: [['openAt', 'ASC']],
  limit: 1
};

function StaticPagesController() {
  this.home = function(req, res) {
    const performance = Performance.findAll(nextPerformanceQuery);
    performance.then((data) => {
      const dataValues = data.dataValues;
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
  }
}

function createPerformanceObj(dataValues) {
  let renderData = {};
  if (dataValues) {
    renderData.performanceName = dataValues.name;
    renderData.openTime = dataValues.openAt.toLocaleString();
    renderData.closeTime = dataValues.closeAt.toLocaleString();
  }
  return renderData;
}
module.exports = StaticPagesController;
