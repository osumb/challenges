const models = require('../models');
const Result = new models.Result();

function ResultsController() {
  this.evaluate = (req, res) => {
    Result.update({
      id: req.params.resultId,
      needsApproval: true,
      firstComments: req.body.firstComments,
      secondComments: req.body.secondComments,
      spotId: req.body.spotId,
      winnerId: req.body.winner
    })
    .then(() =>
      res.redirect('/results/eval')
    )
    .catch((err) => {
      console.error(err);
      res.render('error');
    });
  };

  this.getForEval = (req, res) => {
    Result.findAllForEval(req.user.instrument, req.user.part, req.session.currentPerformance.id)
      .then((results) => res.render('challengesForEval', { user: req.user, results }))
      .catch((err) => {
        console.error(err);
        res.render('error');
      });
  };
}

module.exports = ResultsController;
