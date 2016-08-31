const moment = require('moment');

const Models = require('../models');
const Performance = new Models.Performance();
const { logger } = require('../utils');

const currentPerformance = (req, res, next) => {
  Performance.findNextOrOpenWindow()
  .then((performance) => {
    const now = moment(), { openat, closeat } = performance;

    if (moment(openat).isBefore(now) && now.isBefore(moment(closeat))) {
      req.session.currentPerformance = performance;
    }
    next();
  })
  .catch((err) => {
    logger.errorLog('Middleware.currentPerformance', err);
    next();
  });
};

/* eslint-disable consistent-return */
const refreshCurrentPerformance = (req, res, next) => {
  if (!req.session.currentPerformance) {
    Performance.findNextOrOpenWindow()
    .then((performance) => {
      req.session.currentPerformance = performance;
      req.session.save();
      next();
    })
    .catch((err) => {
      logger.errorLog('Middleware.refreshCurrentPerformance', err);
      next();
    });
  } else {
    return next();
  }
};

module.exports = {
  currentPerformance,
  refreshCurrentPerformance
};
