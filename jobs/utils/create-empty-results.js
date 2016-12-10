const db = require('../../utils/db');
const Challenge = require('../api/models/challenge-model');
const logger = require('../../utils/logger');
const Result = require('../api/models/result-model');

const client = db.createClient();
let PERFORMANCEID;

const sort = (challenges) =>
  challenges.sort((a, b) => a.challengeeSpot.localeCompare(b.challengeeSpot));

const reduce = (challenges) => {
  const reducedChallenges = [];

  for (let i = 0; i < challenges.length; i++) {
    if (challenges[i].spotOpen && i < challenges.length - 1 && challenges[i].challengeeSpot === challenges[i + 1].challengeeSpot) {
      reducedChallenges.push(Object.assign({}, {
        firstNameNumber: challenges[i].firstNameNumber,
        performanceId: PERFORMANCEID,
        secondNameNumber: challenges[i + 1].firstNameNumber,
        spotId: challenges[i].challengeeSpot
      }));
      i += 1;
    } else if (challenges[i].spotOpen && i < challenges.length - 1 && challenges[i].challengeeSpot !== challenges[i + 1].challengeeSpot) {
      reducedChallenges.push(Object.assign({}, {
        firstNameNumber: challenges[i].firstNameNumber,
        performanceId: PERFORMANCEID,
        secondNameNumber: null,
        spotId: challenges[i].challengeeSpot
      }));
    } else {
      reducedChallenges.push(Object.assign({}, {
        firstNameNumber: challenges[i].firstNameNumber,
        performanceId: PERFORMANCEID,
        secondNameNumber: challenges[i].secondNameNumber,
        spotId: challenges[i].challengeeSpot
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

  return Challenge.findAllforEmptyResultsCreation(performanceId)
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
