const Performance = require('../models/Performance');
function PerformanceController() {
  this.show = function(req, res) {
    Performance.findAll().then((performances) => {
      console.log(performances);
      res.render('performance', {performances: performances});
    });
  };
}

module.exports = PerformanceController;
