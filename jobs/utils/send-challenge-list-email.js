const Challenge = require('../../api/models/challenge-model');
const logger = require('../../utils/logger');
const Manage = require('../../api/models/manage-model');
const { sendChallengeList } = require('../../utils/email');

const recipients = process.env.NODE_ENV !== 'production' ?
[
  {
    email: process.env.MAINTAINER_EMAIL
  }
] :
process.env.CHALLENGE_LIST_RECIPIENTS.split(',').map((recipient) => ({
  email: recipient.split(':')[0],
  name: recipient.split(':')[1]
}));

const filterManageActions = (arr) => {
  const filtered = [];

  for (let i = 0; i < arr.length; i++) {
    const { userName, spotId } = arr[i];
    let k = i + 1;

    while (k < arr.length && spotId === arr[k].spotId) {
      k += 1;
    }

    if (spotId === arr[k - 1].spotId && arr[k - 1].reason !== 'Closed Spot') {
      filtered.push({
        userName,
        spotId,
        reason: arr[k - 1].reason
      });
    }
    i = k - 1;
  }

  return filtered;
};

const challengesToCSV = (challenges) =>
  challenges.map(({ challengee, challenger, challengeeSpot, challengerSpot, spotOpen }) =>
    [challengerSpot, challenger, challengeeSpot, spotOpen ? 'Open Spot' : challengee]
  );

const manageActionsTOCSV = (manageActions) =>
  filterManageActions(manageActions).map(({ userName, reason, spotId }) =>
    [spotId, userName, reason]
  );

const getChallengeCSV = (performanceId) =>
  Promise.all([Challenge.findAllForPerformanceCSV(performanceId), Manage.findAllForPerformanceCSV(performanceId)])
  .then((data) => {
    const challenges = challengesToCSV(data[0]).reduce((prev, curr) => `${prev}\n${curr.toString()}`, '');
    const manageActions = manageActionsTOCSV(data[1]).reduce((prev, curr) => `${prev}\n${curr.toString()}`, '');

    return new Buffer(`OSUMB Challenges\nChallenges\n${challenges}\n\nOpen Spots/Automatic Alternates\n${manageActions}`).toString('base64');
  })
  .then(challengeList => challengeList);

const sendChallengeListEmail = (performanceId) => {
  return getChallengeCSV(performanceId)
  .then(csv => {
    sendChallengeList(recipients, csv)
    .then((data) => {
      if (data.statusCode > 300) {
        throw data;
      }
      logger.jobsLog('Send Challenge List Email success', data);
      return data;
    })
    .catch((err) => {
      logger.errorLog('Jobs.sendChallengeListEmail', err);
    });
  })
  .catch((err) => {
    logger.errorLog('Jobs.sendChallengeListEmail', err);
  });
};

module.exports = {
  filterManageActions,
  sendChallengeListEmail
};
