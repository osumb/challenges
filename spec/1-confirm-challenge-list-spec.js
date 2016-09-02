/* eslint-disable no-undef */
const controllers = require('../controllers');
const fixtures = require('../spec/fixtures');
const models = require('../models');

const Challenge = models.Challenge;
const Challenges = new controllers.Challenges();

const { testData } = fixtures;

const { testChallenges, testPerformance } = testData;
const testValidChallenges = testChallenges.filter(({ ErrorCode }) => ErrorCode === 0);

console.log('==> MAKE TEST CHALLENGES');
describe('Make Challenges', () => {
  const res = {
    json: () => {
      return;
    },
    send: () => {
      return;
    }
  };

  beforeEach(() => {
    spyOn(res, 'json');
  });

  testChallenges.forEach(({ ErrorCode, UserNameNumber, SpotId }) => {
    const req = {
      body: {
        spotId: SpotId
      },
      session: {
        currentPerformance: testPerformance
      },
      user: {
        nameNumber: UserNameNumber
      }
    };

    // 0 = Successful challenge
    // 1 = Spot Already Fully Challenged
    // 2 = User Has Already Made A Challenge
    if (ErrorCode === 0) {
      it('Should Make The Challenge', (done) => {
        Challenges.create(req, res)
        .then(() => {
          expect(res.json).toHaveBeenCalledWith({ code: 0 });
          done();
        });
      });
    } else if (ErrorCode === 1) {
      it('Should reject the challenge with error code 1', (done) => {
        Challenges.create(req, res)
        .then(() => {
          expect(res.json).toHaveBeenCalledWith({ code: 1 });
          done();
        });
      });
    } else {
      it('Should reject the challenge with error code 2', (done) => {
        Challenges.create(req, res)
        .then(() => {
          expect(res.json).toHaveBeenCalledWith({ code: 2 });
          done();
        });
      });
    }
  });
});

describe('Created Challenges Are Valid', () => {
  it('Should have the same challenges in the db as the valid test challenges', (done) => {
    Challenge.findAllRawForPerformance(testPerformance.id)
    .then((challenges) => {
      expect(challenges.length).toEqual(testValidChallenges.length);
      jasmine.addCustomEqualityTester(challengeArraysAreEqual);
      expect(challenges).toEqual(testValidChallenges);
      done();
    });
  });
});

const challengeArraysAreEqual = (actual, expected) => {
  actual.sort((a, b) => a.spotid.localeCompare(b.spotid));
  expected.sort((a, b) => a.SpotId.localeCompare(b.SpotId));

  return expected.every(({ UserNameNumber, SpotId }, i) =>
    UserNameNumber === actual[i].usernamenumber && SpotId === actual[i].spotid
  );
};
