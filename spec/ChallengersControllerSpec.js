'use strict';
const ChallengersController = require('../controllers/Challengers');
const mockData = require('../models/mock-data');
const challengers = new ChallengersController();
const Models = require('../models');
const Challenger = Models.Challenger;
const Spot = Models.Spot;
const User = Models.User;
const usersArray = mockData.getUsersFromExcelFile();
const noConflictChallengeList = mockData.getNoConflictChallengeList();
const spotFullChallengeList = mockData.getSpotFullChallengeList();
const wrongPersonChallengeList = mockData.getWrongPersonChallengeList();

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
      validChallengesTest(e);
    });

    spotFullChallengeList.forEach((e) => {
      spotFullChallengeTest(e);
    });

    wrongPersonChallengeList.forEach((e) => {
      wrongPersonChallengeTest(e);
    });

    function validChallengesTest(challengeObj) {
      it('should create a valid challenge and mark the increment the spot count', (done) => {
        req.user = findUserInExcelArray(usersArray, challengeObj.UserNameNumber);
        req.user.nextPerformance = {id: challengeObj.PerformanceId};
        req.body['challenge-form'] = challengeObj.SpotId;
        let promise = challengers.new(req, res);
        promise.then(() => {
          expect(res.render).toHaveBeenCalledWith('challengeSuccess', {SpotId: challengeObj.SpotId, user: jasmine.any(Object)});
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
            done();
          });
        });
      });
    }

    function spotFullChallengeTest(challengeObj) {
      it('should renter the challengeFailure page with the spot full message', (done) => {
        req.user = findUserInExcelArray(usersArray, challengeObj.UserNameNumber);
        req.user.nextPerformance = {id: challengeObj.PerformanceId};
        req.body['challenge-form'] = challengeObj.SpotId;
        let promise = challengers.new(req, res);
        promise.then(() => {
          expect(res.render).toHaveBeenCalledWith('challengeFailure', {message: 'Sorry! That spot has been challenged'});
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
            expect(results[0].dataValues.challengedAmount).toBeLessThan(3);
            expect(results[1].dataValues.eligible).toEqual(true);
            //there shouldn't be data values for a challenge that shouldn't exist
            expect(results[2].dataValues).toEqual(undefined);
            done()
          });
          done();
        });
      });
    }

    function wrongPersonChallengeTest(challengeObj) {
      it('should renter the challengeFailure page with the wrong person message', (done) => {
        req.user = findUserInExcelArray(usersArray, challengeObj.UserNameNumber);
        req.user.nextPerformance = {id: challengeObj.PerformanceId};
        req.body['challenge-form'] = challengeObj.SpotId;
        let promise = challengers.new(req, res);
        promise.then(() => {
          expect(res.render).toHaveBeenCalledWith('challengeFailure', {message: 'Sorry! Your part or instrument doesn\'t match that person'});
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
            expect(results[0].dataValues.challengedAmount).toBeLessThan(3);
            expect(results[1].dataValues.eligible).toEqual(true);
            //there shouldn't be data values for a challenge that shouldn't exist
            expect(results[2].dataValues).toEqual(undefined);
            done()
          });
          done();
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

function findUserInExcelArray(array, nameNumber) {
  let user;
  array.some((e) => {
    if (e.nameNumber === nameNumber) {
      user = e;
      return true;
    }
  });
  return user;
}
