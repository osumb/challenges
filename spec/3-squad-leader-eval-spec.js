/* eslint-disable no-undef */
const controllers = require('../controllers');
const { testData } = require('../spec/fixtures');

const Results = new controllers.Results();
const { testSquadLeaderResultsPermission } = testData;

const headSquadLeaders = testData.testUsers.filter(({ nameNumber }) => testSquadLeaderResultsPermission[nameNumber]);

console.log('==> SQUAD LEADER EVAL PERMISSION CHECK');
describe('Squad eval permission', () => {
  const res = {
    render() {
      return;
    }
  };

  beforeEach(() => {
    spyOn(res, 'render');
  });

  headSquadLeaders.forEach(({ nameNumber, spotId }) => {
    const req = {
      user: {
        nameNumber,
        spotId
      }
    };

    it('should render the eval page with the correct results', (done) => {
      Results.showForEvaluation(req, res)
      .then(() => {
        expect(res.render).toHaveBeenCalledWith(jasmine.any(String), jasmine.objectContaining({
          results: jasmine.any(Array)
        }));
        jasmine.addCustomEqualityTester(sLGotCorrectChallenges);
        expect(res.render.calls.mostRecent().args[1].results).toEqual(req.user.nameNumber);
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
  const sLResults = testSquadLeaderResultsPermission[sLNameNumber];

  if (results.length !== sLResults.length) {
    return false;
  }

  sLResults.sort((a, b) => a[0].localeCompare(b[0]));
  results.sort((a, b) => a.firstNameNumber.localeCompare(b.firstNameNumber));

  return results.every(({ firstNameNumber, secondNameNumber }, i) =>
    firstNameNumber === sLResults[i][0] && secondNameNumber === sLResults[i][1]
  );
};
