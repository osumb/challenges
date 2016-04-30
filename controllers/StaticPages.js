'use strict';
const Models = require('../models');
const Performance = Models.Performance;
const moment = require('moment');
const nextPerformanceQuery = Models.nextPerformanceQuery;

function StaticPagesController() {
  this.home = function(req, res) {
    const performance = Performance.findOne(nextPerformanceQuery);
    performance.then((data) => {
      const dataValues = data ? data.dataValues : data;
      let renderData = createPerformanceObj(dataValues);
      renderData.user = req.user;
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
