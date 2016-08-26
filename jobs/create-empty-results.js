const models = require('../models');
const Challenge = new models.Challenge();
const Result = new models.Result();
const { db, logger } = require('../utils');

const client = db.createClient();
let PERFORMANCEID;

const sort = (challenges) =>
  challenges.sort((a, b) => a.challengeespot.localeCompare(b.challengeespot));

const reduce = (challenges) => {
  const reducedChallenges = [];

  for (let i = 0; i < challenges.length; i++) {
    if (challenges[i].spotopen && i < challenges.length - 1 && challenges[i].challengeespot === challenges[i + 1].challengeespot) {
      reducedChallenges.push(Object.assign({}, {
        firstNameNumber: challenges[i].namenumberone,
        performanceId: PERFORMANCEID,
        secondNameNumber: challenges[i + 1].namenumberone,
        spotId: challenges[i].challengeespot
      }));
      i += 1;
    } else if (challenges[i].spotopen && i < challenges.length - 1 && challenges[i].challengeespot !== challenges[i + 1].challengeespot) {
      reducedChallenges.push(Object.assign({}, {
        firstNameNumber: challenges[i].namenumberone,
        performanceId: PERFORMANCEID,
        secondNameNumber: null,
        spotId: challenges[i].challengeespot
      }));
    } else {
      reducedChallenges.push(Object.assign({}, {
        firstNameNumber: challenges[i].namenumberone,
        performanceId: PERFORMANCEID,
        secondNameNumber: challenges[i].namenumbertwo,
        spotId: challenges[i].challengeespot
      }));
    }
  }
  return reducedChallenges;
};

const insertChallengesAsResults = (challenges) =>
  Promise.all(challenges.map(insertChallengeAsResult));

const insertChallengeAsResult = ({ firstNameNumber, performanceId, secondNameNumber, spotId }) =>
  Result.createWithClient({ firstNameNumber, performanceId, secondNameNumber, spotId }, client);

const createEmptyResults = (performanceId) => {
  PERFORMANCEID = performanceId;

  client.connect();
  client.on('error', console.error);

  return Challenge.findAllForPerformanceCSV(performanceId)
    .then(sort)
    .then(reduce)
    .then(insertChallengesAsResults)
    .then(() => {
      client.end();
      logger.jobsLog('Create Empty Results Success');
    })
    .catch((err) => {
      client.end();
      logger.errorLog('Create Empty Results', err);
    });
};

module.exports = createEmptyResults;
