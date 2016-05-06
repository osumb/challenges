'use strict';
const ChallengersController = require('../controllers/Challengers');
const mockData = require('../models/mock-data');
const challengers = new ChallengersController();
const Models = require('../models');
const Challenger = Models.Challenger;
const Spot = Models.Spot;
const User = Models.User;
const noConflictChallengeList = mockData.getNoConflictChallengeList();

describe('ChallengersController.', () => {
  describe('new: ', () => {
    let req = {}, res = {};
    beforeEach(() => {
      res.render = () => {};
      res.send = () => {};
      req.user = {nextPerformance: {}};
      //how the request form will come in from the browser
      req.body = {'challenge-form': ''};
      spyOn(res, 'render').and.callThrough();
    });

    noConflictChallengeList.forEach((e) => {
      validChallenges(e);
    });

    function validChallenges(challengeObj) {
      it('should create a valid challenge and mark the increment the spot count', (done) => {
        req.user.nameNumber = challengeObj.UserNameNumber;
        req.user.nextPerformance.id = challengeObj.PerformanceId;
        req.body['challenge-form'] = challengeObj.SpotId;
        let spotChallengeCount = 0;
        let promise = challengers.new(req, res);
        promise.then(() => {
          expect(res.render).toHaveBeenCalledWith('challengeSuccess');
          Promise.all([
            Spot.findOne({where: {id: challengeObj.SpotId}}),
            User.findOne({where: {nameNumber: challengeObj.UserNameNumber}}),
            Challenger.findOne({where: {
              UserNameNumber: challengeObj.UserNameNumber,
              PerformanceId: challengeObj.PerformanceId,
              SpotId: challengeObj.SpotId
            }})
          ])
          .then((results) => {
            expect(results[0].dataValues.challengedAmount).toEqual(1);
            expect(results[1].dataValues.eligible).toEqual(false);
            jasmine.addCustomEqualityTester(compareChallengeObjects);
            expect(results[2].dataValues).toEqual(challengeObj);
            done()
          });
        });
      });
    }

  });
});

function compareChallengeObjects(expected, actual) {
  return expected.PerformanceId === actual.PerformanceId &&
         expected.UserNameNumber === actual.UserNameNumber &&
         expected.SpotId === actual.SpotId
}
