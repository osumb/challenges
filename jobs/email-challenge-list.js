const { logger } = require('../utils');
const { Performance } = require('../models');
const { sendChallengeListEmail, createEmptyResults } = require('./utils');

logger.jobsLog('Email Challenge List Check');
Performance.findForListExporting()
  .then(([performance]) => {
    if (!performance) {
      logger.jobsLog('Email Challenge List Check: no email to send');
      return;
    }

    Promise.all([
      sendChallengeListEmail.sendChallengeListEmail(performance.id),
      createEmptyResults(performance.id),
      Performance.update({
        id: performance.id,
        list_exported: true
      })
    ])
      .then(() => {
        logger.jobsLog('Email Challenge List Check: done!');
      })
      .catch((err) => {
        logger.errorLog('Email Challenge List Check', err);
      });
  });
