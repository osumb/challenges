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
      res.redirect('results/show-for-evaluation')
    )
    .catch((err) => {
      console.error(err);
      res.render('error');
    });
  };

  this.showForEvaluation = (req, res) => {
    Result.findAllForEval(req.user.instrument, req.user.part, req.session.currentPerformance.id, req.user.nameNumber)
      .then((results) => {
        if (results.length === 0) {
          results = null; // eslint-disable-line no-param-reassign
        }

        res.render('results/show-for-evaluation', { user: req.user, results });
      })
      .catch((err) => {
        console.error(err);
        res.render('error');
      });
  };

  this.showAll = (req, res) => {
    Result.findAllForPerformance(req.params.performanceId)
    .then(results => res.render('results/show', { user: req.user, results }))
    .catch(err => {
      console.error(err);
      res.render('error', { user: req.user });
    });
  };
}

module.exports = ResultsController;
