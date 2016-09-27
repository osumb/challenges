const models = require('../../models');
const Challenge = models.Challenge;
const Manage = models.Manage;
const { sendChallengeList } = require('../../utils').email;
const { logger } = require('../../utils');

const recipients = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') ?
[
  {
    email: 'tareshawty.3@osu.edu',
    name: 'Alex Tareshawty'
  }
] :
[
  {
    email: 'green.1128@osu.edu',
    name: 'Tess Green'
  },
  {
    email: 'hoch.4@osu.edu',
    name: 'Chris Hoch'
  },
  {
    email: 'osumb@osu.edu',
    name: 'Band Office'
  },
  {
    email: 'tareshawty.3@osu.edu',
    name: 'Alex Tareshawty'
  }
];

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
