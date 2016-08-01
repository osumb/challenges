const models = require('../models');
const { logger } = require('../utils');
const Result = new models.Result();

function ResultsController() {
  this.approve = (req, res) => {
    const { ids } = req.body;

    Result.approve(ids)
    .then(() => {
      const { id } = req.session.currentPerformance;

      res.json({ success: true });
      Result.checkAllDoneForPerformance(id)
      .then(done => {
        if (done) {
          Result.switchSpotsForPerformance(id);
        }
      })
      .catch((err) => {
        logger.errorLog({ level: 2, message: `Results.approve: Result.checkAllDoneForPerformance ${err}` });
      });
    })
    .catch((err) => {
      logger.errorLog({ level: 2, message: `Results.approve: Result.approve ${err}` });
      res.json({ success: false });
    });
  };

  this.getForApproval = (req, res) => {
    Result.findAllForApproval()
    .then((results) => {
      res.render('results/approve', { user: req.user, currentPerformance: req.session.currentPerformance, results });
    })
    .catch((err) => {
      logger.errorLog({ level: 2, message: `Results.getForApproval ${err}` });
      res.render('static-pages/error');
    });
  };

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
      logger.errorLog({ level: 2, message: `Results.evaluate ${err}` });
      res.render('static-pages/error');
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
        logger.errorLog({ level: 2, message: `Results.showForEvaluation ${err}` });
        res.render('static-pages/error');
      });
  };

  this.showAll = (req, res) => {
    Result.findAllForPerformance(req.params.performanceId)
    .then(results => res.render('results/show', { user: req.user, results }))
    .catch(err => {
      logger.errorLog({ level: 2, message: `Results.showAll ${err}` });
      res.render('static-pages/error', { user: req.user });
    });
  };
}

module.exports = ResultsController;
