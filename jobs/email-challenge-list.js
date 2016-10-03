const { logger } = require('../utils');
const { Performance } = require('../models');
const { sendChallengeListEmail, createEmptyResults } = require('./utils');

const helper = (id) =>
  Promise.all([
    sendChallengeListEmail.sendChallengeListEmail(id),
    createEmptyResults(id),
    Performance.update({
      id,
      list_exported: true
    })
  ])
    .then(() => {
      logger.jobsLog('Email Challenge List Check: done!');
    })
    .catch((err) => {
      logger.errorLog('Email Challenge List Check', err);
    });

module.exports = (performanceId) => {
  logger.jobsLog('Email Challenge List Check');

  if (performanceId) {
    return helper(performanceId);
  } else {
    return Performance.findForListExporting()
      .then(([performance]) => {
        if (performance) {
          return helper(performance.id);
        }
        logger.jobsLog('Email Challenge List Check: no email to send');
        return Promise.resolve();
      });
  }
};
