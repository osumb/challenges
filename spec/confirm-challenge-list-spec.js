/* eslint-disable no-undef */
const controllers = require('../controllers');
// const db = require('../utils').db;
const fixtures = require('../spec/fixtures');

const Challenges = new controllers.Challenges();
// const Performances = new controllers.Performances();
// const Results = new controllers.Results();
// const Sessions = new controllers.Sessions();
// const StaticPages = new controllers.StaticPages();
// const Users = new controllers.Users();

const { testData } = fixtures;

const { testChallenges, testPerformance } = testData;

console.log('==> MAKE TEST CHALLENGES');

/* MAKE CHALLENGES */
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
