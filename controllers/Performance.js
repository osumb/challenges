const Performance = require('../models').Performance;
function PerformanceController() {
  this.showAll = (req, res) => {
    Performance.findAll().then((performances) => {
      res.render('performance', {performances: performances});
    });
  };

  this.show = (req, res) => {
    console.log('performance:  ', req.params.performance);
    const performanceQuery = Performance.findOne({
      where: {
        name: req.params.performance
      }
    });
    performanceQuery.then((performance) => {
      res.send(performance);
    });
  };

  this.new = (req, res) => {
    res.send('new performance!');
  };
}

module.exports = PerformanceController;
