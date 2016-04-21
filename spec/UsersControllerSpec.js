'use strict';
const UsersController = require('../controllers/Users');
const mockData = require('../models/mock-data');
const users = new UsersController();
const usersArray = mockData.getUsersFromExcelFile();
const config = require('../config/config');describe('Users Controller.', () => {
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
});

function compareUserArrays(dbUsers, mockUsers) {
  let arraysEqual = true;
  if (dbUsers.length != mockUsers.length) arraysEqual = false;
  else {
    dbUsers.some((e, i) => {
      arraysEqual = compareUserValues(e.dataValues, mockUsers[i]);
      if (!arraysEqual) {
        console.log(e.dataValues);
        console.log(mockUsers[i]);
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
