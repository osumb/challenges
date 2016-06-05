// const Result = require('../models').Result;

function ResultsController() {
  this.evaluate = (req, res) => {
    console.log(req.body);
    res.redirect('/performances/1/eval');
  };
}

module.exports = ResultsController;
