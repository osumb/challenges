const Models = require('../models');
const Performance = new Models.Performance();
const { logger } = require('../utils');

/* eslint-disable consistent-return */
const refreshCurrentPerformance = (req, res, next) => {
  if (!Performance.inPerformanceWindow(req.session.currentPerformance)) {
    Performance.findNextOrOpenWindow()
    .then((performance) => {
      if (Performance.inPerformanceWindow(performance)) {
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
