/* eslint-disable no-undef */
const { testData } = require('../spec/fixtures');
const models = require('../models');

const Result = new models.Result();
const { testResults } = testData;

console.log('==> EVAULATE RESULTS');
describe('Evaluate Results', () => {
  testResults.forEach(({ firstNameNumber, winnerId, comments1, comments2 }) => {
    it('Should evaluate all of the results', (done) => {
      Result.updateForTestsOnly(firstNameNumber, comments1, comments2, winnerId)
      .then(() => {
        done();
      });
    });
  });
});
