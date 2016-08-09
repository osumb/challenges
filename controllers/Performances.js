const models = require('../models');
const schedule = require('node-schedule');
const { logger } = require('../utils');
const { sendChallengeListEmail, createEmptyResults } = require('../jobs');

const Performance = new models.Performance();

function PerformanceController() {
  // This assumes `openAt` and `closeAt` are already coming in ISO 8601 format as UTC time
  this.create = (req, res) => {
    const { closeAt, performanceName, performanceDate, openAt } = req.body;

    Performance.create(performanceName, performanceDate, openAt, closeAt)
    .then(({ id, utcCloseAt }) => {
      const performanceWindowClose = new Date(utcCloseAt), minutesMultiplier = 60000;

      schedule.scheduleJob(new Date(performanceWindowClose.getTime() + 5 * minutesMultiplier), () => {
        sendChallengeListEmail.sendChallengeListEmail(id);
        createEmptyResults(id);
      });
      Performance.flagCurrent();
      res.json({ success: true });
    })
    .catch(err => {
      logger.errorLog('Performances.new', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.new = (req, res) => {
    res.render('performances/new', { user: req.user });
  };

  this.showAll = (req, res) => {
    Performance.findAll('MMMM Do, h:mm:ss a')
      .then((performances) => res.json(performances))
      .catch((err) => {
        logger.errorLog('Performances.showAll', err);
        res.render('static-pages/error');
      });
  };
}

module.exports = PerformanceController;
