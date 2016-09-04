/* eslint-disable no-undef */
const { createEmptyResults } = require('../jobs');
const { testData } = require('../spec/fixtures');
const models = require('../models');

const { testPerformance, testResults } = testData;
const { id } = testPerformance;

const Result = models.Result;

console.log('==> CREATE EMPTY RESULTS');
describe('Create Empty Results', () => {
  it('Should create the correct empty results', (done) => {
    createEmptyResults(id)
    .then(() => {
      Result.findAllRawForPerformance(id)
      .then((results) => {
        expect(results.length).toEqual(testResults.length);
        jasmine.addCustomEqualityTester(resultsCompare);
        expect(results).toEqual(testResults);
        done();
      });
    });
  });
});

const resultsCompare = (actual, expected) => {
  actual.sort((a, b) => a.spotId.localeCompare(b.spotId));
  expected.sort((a, b) => a.SpotId.localeCompare(b.SpotId));

  return expected.every(({ firstNameNumber, secondNameNumber, SpotId }, i) => {
    if (secondNameNumber) {
      if (!(firstNameNumber === actual[i].firstNameNumber && secondNameNumber === actual[i].secondNameNumber && SpotId === actual[i].spotId)) {
        console.log(expected[i]);
        console.log(actual[i]);
      }
      return firstNameNumber === actual[i].firstNameNumber && secondNameNumber === actual[i].secondNameNumber && SpotId === actual[i].spotId;
    } else {
      if (!(firstNameNumber === actual[i].firstNameNumber && SpotId === actual[i].spotId)) {
        console.log(expected[i]);
        console.log(actual[i]);
      }
      return firstNameNumber === actual[i].firstNameNumber && SpotId === actual[i].spotId;
    }
  });
};
