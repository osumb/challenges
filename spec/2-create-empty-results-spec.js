/* eslint-disable no-undef */
const { createEmptyResults } = require('../jobs/utils');
const testData = require('./fixtures/test');
const Result = require('../api/models/result-model');

const { performance, results } = testData;
const { id } = performance;

console.log('==> CREATE EMPTY RESULTS');
describe('Create Empty Results', () => {
  it('Should create the correct empty results', (done) => {
    createEmptyResults(id)
    .then(() => {
      Result.findAllRawForPerformance(id)
      .then((resultsResp) => {
        expect(resultsResp.length).toEqual(results.length);
        jasmine.addCustomEqualityTester(resultsCompare);
        expect(resultsResp).toEqual(results);
        done();
      });
    });
  });
});

const resultsCompare = (actual, expected) => {
  actual.sort((a, b) => a.spotId.localeCompare(b.spotId));
  expected.sort((a, b) => a.spotId.localeCompare(b.spotId));

  return expected.every(({ firstNameNumber, secondNameNumber, spotId }, i) => {
    if (secondNameNumber) {
      if (!(firstNameNumber === actual[i].firstNameNumber && secondNameNumber === actual[i].secondNameNumber && spotId === actual[i].spotId)) {
        console.log(expected[i]);
        console.log(actual[i]);
      }
      return firstNameNumber === actual[i].firstNameNumber && secondNameNumber === actual[i].secondNameNumber && spotId === actual[i].spotId;
    } else {
      if (!(firstNameNumber === actual[i].firstNameNumber && spotId === actual[i].spotId)) {
        console.log(expected[i]);
        console.log(actual[i]);
      }
      return firstNameNumber === actual[i].firstNameNumber && spotId === actual[i].spotId;
    }
  });
};
