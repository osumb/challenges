const logger = require('../../utils/logger');
const Performance = require('../models/performance-model');

class PerformancesController {

  // This assumes `openAt` and `closeAt` are already coming in ISO 8601 format as UTC time
  static create(req, res, next) {
    const { closeAt, performanceName, performanceDate, openAt } = req.body;

    Performance.create(performanceName, performanceDate, openAt, closeAt)
    .then(() => {
      res.locals.jsonResp = { success: true };
      next();
    })
    .catch(err => {
      logger.errorLog('Performances.new', err);
      res.render('static-pages/error', { user: req.user });
    });
  }

  static index(req, res) {
    Performance.findAll('MMMM Do, h:mm:ss a')
    .then((performances) => {
      res.render('performances/index', { user: req.user, performances: performances.map((performance) => performance.toJSON()) });
    })
    .catch((err) => {
      logger.errorLog('Performances.index', err);
      res.render('static-pages/error', { user: req.user });
    });
  }

}

module.exports = PerformancesController;
