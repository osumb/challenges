/* eslint-disable no-undef */
const Challenge = require('../api/models/challenge-model');
const Challenges = require('../api/controllers/challenges-controller');
const testData = require('./fixtures/test');

const { challenges, performance } = testData;
const testValidChallenges = challenges.filter(({ errorCode }) => errorCode === 0);

console.log('==> MAKE TEST CHALLENGES');
describe('Make Challenges', () => {
  const res = {
    locals: {}
  };
  const next = () => Promise.resolve;

  beforeEach(() => {
    res.locals = {};
  });

  challenges.forEach(({ errorCode, userNameNumber, spotId }) => {
    const req = {
      body: {
        spotId
      },
      user: {
        nameNumber: userNameNumber
      }
    };

    // 0 = Successful challenge
    // 1 = Spot Already Fully Challenged
    // 2 = User Has Already Made A Challenge
    if (errorCode === 0) {
      it('Should Make The Challenge', (done) => {
        Challenges.create(req, res, next)
        .then(() => {
          expect(res.locals.jsonResp).toEqual({ code: 0 });
          done();
        })
        .catch((err) => console.error(err));
      });
    } else if (errorCode === 1) {
      it('Should reject the challenge with error code 1', (done) => {
        Challenges.create(req, res, next)
        .then(() => {
          expect(res.locals.jsonResp).toEqual({ code: 1 });
          done();
        })
        .catch(err => console.error(err));
      });
    } else {
      it('Should reject the challenge with error code 2', (done) => {
        Challenges.create(req, res, next)
        .then(() => {
          expect(res.locals.jsonResp).toEqual({ code: 2 });
          done();
        }).catch((err) => {
          console.error(err);
        });
      });
    }
  });
});

describe('Created Challenges Are Valid', () => {
  it('Should have the same challenges in the db as the valid test challenges', (done) => {
    Challenge.findAllRawForPerformance(performance.id)
    .then((challengesResp) => {
      expect(challengesResp.length).toEqual(testValidChallenges.length);
      jasmine.addCustomEqualityTester(challengeArraysAreEqual);
      expect(challengesResp).toEqual(testValidChallenges);
      done();
    })
    .catch((err) => console.error(err));
  });
});

describe('Created Challenges Are Valid', () => {
  it('Should have the same challenges in the db as the valid test challenges', (done) => {
    Challenge.findAllRawForPerformance(performance.id)
    .then((challengesResp) => {
      expect(challengesResp.length).toEqual(testValidChallenges.length);
      jasmine.addCustomEqualityTester(challengeArraysAreEqual);
      expect(challengesResp).toEqual(testValidChallenges);
      done();
    })
    .catch((err) => console.error(err));
  });
});

const challengeArraysAreEqual = (actual, expected) => {
  actual.sort((a, b) => a.spotid.localeCompare(b.spotid));
  expected.sort((a, b) => a.spotId.localeCompare(b.spotId));

  return expected.every(({ userNameNumber, spotId }, i) =>
    userNameNumber === actual[i].usernamenumber && spotId === actual[i].spotid
  );
};
