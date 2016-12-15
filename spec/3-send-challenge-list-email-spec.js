/* eslint-disable no-undef */
const { sendChallengeListEmail } = require('../jobs/utils');
const { performance } = require('./fixtures/test');

const { id } = performance;

console.log('==> SEND CHALLENGE LIST EMAIL');
describe('Send Challenge List Email', () => {
  it('Should send the challenge list email', (done) => {
    sendChallengeListEmail.sendChallengeListEmail(id)
    .then(() => {
      done();
    });
  });
});
