const models = require('../models');
const Challenge = new models.Challenge();
const { sendChallengeList } = require('../utils').email;
const { logger } = require('../utils');

const toCSV = (challenges) =>
  challenges.map(({ challengee, challenger, challengeespot, challengerspot, spotopen }) =>
    [challengerspot, challenger, challengeespot, spotopen ? 'Open Spot' : challengee]
  );

const getChallengeCSV = (performanceId) =>
  Challenge.findAllForPerformanceCSV(performanceId)
  .then(challengeList =>
    new Buffer(toCSV(challengeList).reduce((prev, curr) =>
      `${prev}\n${curr.toString()}`, `OSUMB Challenges\nChallenges`)).toString('base64')
  )
  .then(challengeList => challengeList);

const sendChallengeListEmail = (performanceId) => {
  getChallengeCSV(performanceId)
  .then(csv => {
    sendChallengeList('atareshawty@gmail.com', csv) // TODO: Actually email to band office
    .catch((err) => {
      logger.errorLog({ level: 3, message: `Jobs.sendChallengeListEmail ${err}` });
    });
  })
  .catch((err) => {
    logger.errorLog({ level: 3, message: `Jobs.sendChallengeListEmail ${err}` });
  });
};

module.exports = {
  sendChallengeListEmail
};
