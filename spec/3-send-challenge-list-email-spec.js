/* eslint-disable no-undef */
const { sendChallengeListEmail } = require('../jobs');
const { testData } = require('../spec/fixtures');

const { id } = testData.testPerformance;

console.log('==> SEND CHALLENGE LIST EMAIL');
describe('Send Challenge List Email', () => {
  it('Should send the challenge list email', (done) => {
    sendChallengeListEmail.sendChallengeListEmail(id)
    .then(() => {
      done();
    });
  });
});
