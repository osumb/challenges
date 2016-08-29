const models = require('../models');
const { logger } = require('../utils');
const Result = new models.Result();

function ResultsController() {
  this.approve = (req, res) => {
    const { ids } = req.body;

    Result.approve(ids)
    .then((performanceId) => {
      res.json({ success: true });
      Result.checkAllDoneForPerformance(performanceId)
      .then(done => {
        if (done) {
          Result.switchSpotsForPerformance(performanceId);
        }
      })
      .catch((err) => {
        logger.errorLog('Results.approve: Result.checkAllDoneForPerformance', err);
      });
    })
    .catch((err) => {
      logger.errorLog('Results.approve: Result.approve', err);
      res.json({ success: false });
    });
  };

  this.getForApproval = (req, res) => {
    Result.findAllForApproval(req.user)
    .then((results) => {
      res.render('results/approve', { user: req.user, results });
    })
    .catch((err) => {
      logger.errorLog('Results.getForApproval', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.evaluate = (req, res) => {
    Result.update({
      id: req.body.id,
      needsApproval: true,
      firstComments: req.body.firstComments,
      secondComments: req.body.secondComments,
      spotId: req.body.spotId,
      winnerId: req.body.winnerId
    })
    .then(() => {
      logger.actionLog(`${req.user.name} evaulated result ${req.body.id}. ${req.body.winnerId} won`);
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      logger.errorLog('Results.evaluate', err);
      res.status(500).send({ success: false });
    });
  };

  this.showForEvaluation = (req, res) => {
    return Result.findAllForEval(req.user.nameNumber, req.user.spotId[0])
      .then((results) => {
        if (results.length === 0) {
          results = null; // eslint-disable-line no-param-reassign
        }

        res.render('results/show-for-evaluation', { user: req.user, results });
      })
      .catch((err) => {
        logger.errorLog('Results.showForEvaluation', err);
        res.render('static-pages/error', { user: req.user });
      });
  };

  this.showAll = (req, res) => {
    Result.findAllForPerformance(req.params.performanceId)
    .then(results => res.render('results/show', { user: req.user, results }))
    .catch(err => {
      logger.errorLog('Results.showAll', err);
      res.render('static-pages/error', { user: req.user });
    });
  };
}

module.exports = ResultsController;
