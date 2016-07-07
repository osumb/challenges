const models = require('../models');
const Performance = new models.Performance();

function PerformanceController() {
  this.showAll = (req, res) => {
    Performance.findAll('MMMM Do, h:mm:ss a')
      .then((performances) => res.json(performances))
      .catch(() => res.render('static-pages/error'));
  };
}

module.exports = PerformanceController;
