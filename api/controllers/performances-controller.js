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
    .catch((err) => {
      logger.errorLog('Performances.new', err);
      res.status(500).send();
    });
  }

  static index(req, res, next) {
    Performance.findAll('MMMM Do, h:mm:ss a')
    .then((performances) => {
      res.locals.jsonResp = { performances };
      next();
    })
    .catch((err) => {
      logger.errorLog('Performances.index', err);
      res.render('static-pages/error', { user: req.user });
    });
  }

  static update({ body }, res, next) {
    Performance.update(body)
    .then(() => {
      res.locals.jsonResp = { success: true };
      next();
    })
    .catch((err) => {
      logger.errorLog('Performances.update', err);
      res.status(500).send('Error updating performance');
    });
  }

}

module.exports = PerformancesController;
