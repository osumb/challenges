/* eslint-disable no-undef */
const { testData } = require('../spec/fixtures');
const models = require('../models');

const Result = models.Result;
const User = models.User;
const { testFinalSpots, testPerformance, testResults } = testData;

console.log('==> APPROVE RESULTS');
describe('Approve Results', () => {
  it('Should approve the results', (done) => {
    Result.approve([...Array(testResults.length + 1).keys()])
    .then(() => {
      done();
    });
  });
});

console.log('==> SWITCH SPOTS');
describe('Switch Spots', () => {
  it('Should switch spots', (done) => {
    Result.switchSpotsForPerformance(testPerformance.id)
    .then(() => {
      done();
    });
  });

  testFinalSpots.forEach(({ nameNumber, spotId }) => {
    it('Should switch spots correctly', (done) => {
      User.findByNameNumber(nameNumber)
      .then(({ spotId: userSpotId }) => {
        expect(userSpotId).toEqual(spotId);
        done();
      });
    });
  });
});
