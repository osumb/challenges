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
});

function compareUserArrays(dbUsers, mockUsers) {
  let arraysEqual = true;
  if (dbUsers.length != mockUsers.length) arraysEqual = false;
  else {
    dbUsers.some((e, i) => {
      arraysEqual = compareUserValues(e.dataValues, mockUsers[i]);
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
         dbUser.SpotId ===  mockUser.SpotId;
}
