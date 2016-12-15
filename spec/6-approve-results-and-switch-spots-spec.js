/* eslint-disable no-undef */
const testData = require('./fixtures/test');
const Result = require('../api/models/result-model');
const User = require('../api/models/user-model');

const { finalSpots, performance, results } = testData;

console.log('==> APPROVE RESULTS');
describe('Approve Results', () => {
  it('Should approve the results', (done) => {
    Result.approve([...Array(results.length + 1).keys()])
    .then(() => {
      done();
    });
  });
});

console.log('==> SWITCH SPOTS');
describe('Switch Spots', () => {
  it('Should switch spots', (done) => {
    Result.switchSpotsForPerformance(performance.id)
    .then(() => {
      done();
    });
  });

  finalSpots.forEach(({ nameNumber, spotId }) => {
    it('Should switch spots correctly', (done) => {
      User.findByNameNumber(nameNumber)
      .then(({ spotId: userSpotId }) => {
        expect(userSpotId).toEqual(spotId);
        done();
      });
    });
  });
});
