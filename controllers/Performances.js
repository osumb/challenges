const models = require('../models');
const Performance = new models.Performance();

function PerformanceController() {
  this.create = (req, res) => {
    const { performanceName, performanceDate, openAt, closeAt, current } = req.body;

    Performance.create(performanceName, performanceDate, openAt, closeAt, current)
    .then(() => {
      // TODO: create cron job
      res.json({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.new = (req, res) => {
    res.render('performances/new', { user: req.user });
  };

  this.showAll = (req, res) => {
    Performance.findAll('MMMM Do, h:mm:ss a')
      .then((performances) => res.json(performances))
      .catch(() => res.render('static-pages/error'));
  };
}

module.exports = PerformanceController;
