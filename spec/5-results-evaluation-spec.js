/* eslint-disable no-undef */
const { results } = require('./fixtures/test');
const Result = require('../api/models/result-model');

console.log('==> EVAULATE RESULTS');
describe('Evaluate Results', () => {
  results.forEach(({ firstNameNumber, winnerId, comments1, comments2 }) => {
    it('Should evaluate all of the results', (done) => {
      Result.updateForTestsOnly(firstNameNumber, comments1, comments2, winnerId)
      .then(() => {
        done();
      });
    });
  });
});
