const models = require('../models');
const { logger } = require('../utils');
const Result = models.Result;

function ResultsController() {
  this.approve = (req, res) => {
    const { ids } = req.body;

    Result.approve(ids)
    .then(([performanceId]) => {
      res.json({ success: true });
      Result.checkAllDoneForPerformance(performanceId)
      .then(([done]) => {
        if (done) {
          logger.actionLog(`Starting to switch spots for performance ${performanceId}`);
          Result.switchSpotsForPerformance(performanceId)
          .then(() => logger.actionLog(`Done switching spots for performance ${performanceId}`))
          .catch((err) => logger.errorLog('Result.switchSpotsForPerformance', err));
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

  this.evaluate = (req, res) => {
    Result.update({
      id: req.body.id,
      needsApproval: true,
      firstComments: req.body.firstComments,
      secondComments: req.body.secondComments || '',
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

  this.getForApproval = (req, res) => {
    Result.findAllForApproval(req.user)
    .then((results) => {
      res.json({ results: results.map((result) => result.toJSON()) });
    })
    .catch((err) => {
      logger.errorLog('Results.getForApproval', err);
      res.status(500).send();
    });
  };

  this.index = (req, res) => {
    Result.index()
    .then((performanceResultsMap) => {
      res.json({ performanceResultsMap });
    })
    .catch((err) => {
      logger.errorLog('Results.index', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.getForEvaluation = (req, res) => {
    return Result.findAllForEval(req.user.nameNumber, (req.user.spotId || '')[0])
      .then((results) => {
        res.json({ results: results.map((result) => result.toJSON()) });
      })
      .catch((err) => {
        logger.errorLog('Results.showForEvaluation', err);
        res.status(500).send();
      });
  };
}

module.exports = ResultsController;
