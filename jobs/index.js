const models = require('../models');
const Challenge = new models.Challenge();
const { sendChallengeList } = require('../utils').email;

const toCSV = challenges => {
  return challenges.map(({ challengee, challenger, challengeespot, challengerspot, spotopen }) => {
    const challengeeString = spotopen ? 'Open Spot' : challengee;

    return [challengerspot, challenger, challengeespot, challengeeString];
  });
};

const getChallengeCSV = performanceId =>
  Challenge.findAllForPerformanceCSV(performanceId)
  .then(challengeList =>
    new Buffer(toCSV(challengeList).reduce((prev, curr) =>
      `${prev}\n${curr.toString()}`, `OSUMB Challenges\nChallenges`)).toString('base64')
  )
  .then(challengeList => challengeList);

const sendChallengeListEmail = (performanceId) => {
  getChallengeCSV(performanceId)
  .then(csv => {
    sendChallengeList('atareshawty@gmail.com', csv)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
};

module.exports = {
  sendChallengeListEmail
};
