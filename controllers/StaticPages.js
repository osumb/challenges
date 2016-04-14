'use strict';
const Performance = require('../models').Performance;
const moment = require('moment');
const nextPerformanceQuery = {
  where: {
    closeAt: {
      $gt: new Date()
    }
  },
  limit: 1,
  orderBy: ['openAt', 'ASC']
};

function StaticPagesController() {
  this.home = function(req, res) {
    let performance;
    if (req.isAuthenticated()) {
      performance = Performance.findOne(nextPerformanceQuery);
      performance.then((data) => {
        const dataValues = data.dataValues;
        let renderData = createPerformanceObj(dataValues);
        res.render('index', renderData);
      });

      performance.catch(() => {
        res.render('error');
      });
    } else {
      res.render('noAuth');
    }
    return performance;
  };
}

function createPerformanceObj(dataValues) {
  let renderData = {};
  if (dataValues) {
    renderData.performanceName = dataValues.name;
    renderData.openTime = moment(dataValues.openAt).format();
    renderData.closeTime = moment(dataValues.closeAt).format();
  }
  return renderData;
}
module.exports = StaticPagesController;
