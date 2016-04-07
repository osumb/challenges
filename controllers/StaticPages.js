'use strict';
const Performance = require('../models').Performance;

function StaticPagesController() {
  this.home = function(req, res) {
    const performance = Performance.findById(1);
    performance.then((data) => {
      const dataValues = data.dataValues;
      let renderData = {
        performanceName: dataValues.name,
        openTime: dataValues.openAt.toLocaleString(),
        closeTime: dataValues.closeAt.toLocaleString()
      };
      res.render('index', renderData);
    });
    return performance;
  };
}

module.exports = StaticPagesController;
