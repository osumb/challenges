const Performance = require('../models').Performance;
function PerformanceController() {
  this.showAll = (req, res) => {
    Performance.findAll().then((performances) => {
      res.render('performance', {performances: performances});
    });
  };
}

module.exports = PerformanceController;
