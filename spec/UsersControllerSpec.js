'use strict';
const UsersController = require('../controllers/Users');
const mockData = require('../models/mock-data');
const users = new UsersController();
const usersArray = mockData.getUsersFromExcelFile();
const eligibleChallengers = mockData.getEligibleChallengers(usersArray);
const config = require('../config/config');
const User = require('../models').User;
const Spot = require('../models').Spot;
const challengeablePeopleQuery = require('../models').challengeablePeopleQuery;

describe('Users Controller.', () => {
  describe('showAll: ', () => {
    let req = {}, res = {};
    beforeEach((done) => {
      res.render = () => {};
      spyOn(res, 'render').and.callThrough();
      let promise = users.showAll(req, res);
      promise.then(() => {
        done();
      });
    });

    it('should render the users view with all of the users', () => {
      expect(res.render).toHaveBeenCalledWith('users', jasmine.any(Object));
      jasmine.addCustomEqualityTester(compareUserArrays);
      expect(res.render.calls.mostRecent().args[1].users).toEqual(usersArray);
    });
  });

  describe('showProfile: ', () => {
    let req = {}, res = {};
    req.params = {};
    beforeEach((done) => {
      res.render = () => {};
      //get A13
      req.user = usersArray[12];
      spyOn(res, 'render').and.callThrough();
      //when result data is built in, there will be a promise that resolves
      let promise = users.showProfile(req, res);
      if (promise) promise.then(() => {done();});
      else done();
    });

    it('should render the userProfile view', () => {
      expect(res.render).toHaveBeenCalledWith('userProfile', jasmine.any(Object));
    });
  });

  describe('showChallengeSelect: ', () => {
    let req = {}, res = {};

    //we want to test all of the 'challengeable people' for each eligible challenger, so we'll make a loop of tests
    function addTest(user) {
      it('should render the challengeSelect view with the correct data', (done) => {
        req.user = user;
        User.findAll(challengeablePeopleQuery(user)).then((challengeableUsers) => {
          users.showChallengeSelect(req, res).then(() => {
            jasmine.addCustomEqualityTester(compareUserArrays);
            expect(res.render.calls.mostRecent().args[1].challengeableUsers).toEqual(challengeableUsers);
            done();
          });
        });
      });
    }

    beforeEach(() => {
      res.render = () => {};
      spyOn(res, 'render').and.callThrough();
    });

    it('should render the challengeSelect view', () => {
      req.user = eligibleChallengers[0];
      users.showChallengeSelect(req, res).then(() => {
        expect(res.render).toHaveBeenCalledWith('challengeSelect', jasmine.any(Object));
      });
    });

    for (let user in eligibleChallengers) {
      addTest(user);
    }

    it('should render the challengeSelect view with the correct user', () => {
      req.user = eligibleChallengers[0];
      users.showChallengeSelect(req, res).then(() => {
        expect(res.render.calls.mostRecent().args[1].user).toEqual(req.user);
      });
    });

  });
});

function compareUserArrays(dbUsers, mockUsers) {
  let arraysEqual = true;
  if (dbUsers.length != mockUsers.length) arraysEqual = false;
  else {
    dbUsers.some((e, i) => {
      let mock = mockUsers[i].dataValues || mockUsers[i];
      arraysEqual = compareUserValues(e.dataValues, mock);
      if (!arraysEqual) {
        console.log('\n\nWe found a mismatch!\n\n');
        console.log(e.dataValues);
        console.log(mock);
      }
      return !arraysEqual;
    });
  }
  return arraysEqual;
}

function compareUserValues(dbUser, mockUser) {
  return dbUser.nameNumber === mockUser.nameNumber &&
         dbUser.name === mockUser.name &&
         dbUser.instrument === mockUser.instrument &&
         dbUser.part === (mockUser.part || null) &&
         dbUser.SpotId ===  mockUser.SpotId &&
         dbUser.admin === mockUser.admin &&
         dbUser.squadLeader === mockUser.squadLeader &&
         dbUser.eligible === mockUser.eligible;
}
