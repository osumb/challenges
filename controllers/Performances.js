const models = require('../models');
const { logger } = require('../utils');

const Performance = models.Performance;

function PerformanceController() {
  // This assumes `openAt` and `closeAt` are already coming in ISO 8601 format as UTC time
  this.create = (req, res) => {
    const { closeAt, performanceName, performanceDate, openAt } = req.body;

    Performance.create(performanceName, performanceDate, openAt, closeAt)
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => {
      logger.errorLog('Performances.new', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.index = (req, res) => {
    Performance.findAll('MMMM Do, h:mm:ss a')
    .then((performances) => {
      res.render('performances/index', { user: req.user, performances: performances.map((performance) => performance.toJSON()) });
    })
    .catch((err) => {
      logger.errorLog('Performances.index', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.new = (req, res) => {
    res.render('performances/new', { user: req.user });
  };

  this.update = ({ body }, res) => {

  };

}

module.exports = PerformanceController;
