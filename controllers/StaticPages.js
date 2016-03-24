'use strict';
const Performance = require('../models/Performance');

function StaticPagesController() {
  this.home = function(req, res) {
    Performance.findById(1).then((data) => {
      const dataValues = data.dataValues;
      let renderData = {
        performanceName: dataValues.name,
        openAt: dataValues.openAt.toDateString(),
        closeAt: dataValues.closeAt.toDateString()
      };
      res.render('index', renderData);

    });
  };
}

module.exports = StaticPagesController;
