/* eslint-disable no-undef */
const Results = require('../api/controllers/results-controller');
const testData = require('./fixtures/test');

const { squadLeaderPermissions } = testData;

const headSquadLeaders = testData.users.filter(({ nameNumber }) => squadLeaderPermissions[nameNumber]);

console.log('==> SQUAD LEADER EVAL PERMISSION CHECK');
describe('Squad eval permission', () => {
  const res = {
    locals: {}
  };
  const next = () => Promise.resolve;

  beforeEach(() => {
    res.locals = {};
  });

  headSquadLeaders.forEach(({ nameNumber, spotId }) => {
    const req = {
      user: {
        nameNumber,
        spotId
      }
    };

    it('should send json with the correct results', (done) => {
      Results.getForEvaluation(req, res, next)
      .then(() => {
        // expect(res.json).toHaveBeenCalledWith(jasmine.objectContaining({
        //   results: jasmine.any(Array)
        // }));
        jasmine.addCustomEqualityTester(sLGotCorrectChallenges);
        expect(res.locals.jsonResp.results).toEqual(req.user.nameNumber);
        done();
      })
      .catch((err) => {
        console.error(err);
        done();
      });
    });
  });
});

const sLGotCorrectChallenges = (results, sLNameNumber) => {
  const sLResults = squadLeaderPermissions[sLNameNumber];

  if (results.length !== sLResults.length) {
    return false;
  }

  sLResults.sort((a, b) => a[0].localeCompare(b[0]));
  results.sort((a, b) => a.firstNameNumber.localeCompare(b.firstNameNumber));

  return results.every(({ firstNameNumber, secondNameNumber }, i) =>
    firstNameNumber === sLResults[i][0] && secondNameNumber === sLResults[i][1]
  );
};
