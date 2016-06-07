const models = require('../models');
const Result = new models.Result();

function ResultsController() {
  this.evaluate = (req, res) => {
    Result.update({
      id: req.params.resultId,
      needsApproval: true,
      firstComments: req.body.firstComments,
      performanceId: 1,
      secondComments: req.body.secondComments,
      spotId: req.body.spotId,
      winnerId: req.body.winner
    })
    .then(() =>
      res.redirect('/performances/1/eval')
    )
    .catch((err) => {
      console.error(err);
      res.render('error');
    });
  };
}

module.exports = ResultsController;
