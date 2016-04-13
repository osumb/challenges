// const Result = require('../models').Result;

function ResultsController() {
  this.showForUser = (req, res) => {
    res.send('Results for user');
  };
}

module.exports = ResultsController;
