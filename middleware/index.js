const models = require('../models');
const Performance = models.Performance;
const { logger } = require('../utils');

/* eslint-disable consistent-return */
const refreshCurrentPerformance = (req, res, next) => {
  if (!req.session.currentPerformance || req.session.currentPerformance.inPerformanceWindow()) {
    Performance.findNextOrOpenWindow()
    .then((performance) => {
      if (performance.inPerformanceWindow()) {
        req.session.currentPerformance = performance;
      } else {
        delete req.session.currentPerformance;
      }
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
  refreshCurrentPerformance
};
