'use strict';
const UsersController = require('../controllers/Users');
const mockData = require('../models/mock-data');
const users = new UsersController();
describe('Users Controller => ', () => {
  describe('Show All', () => {
    describe('Not Authenticated, but admin', () => {
      let req = {}, res = {};
      beforeEach((done) => {
        res.render = () => {};
        req.isAuthenticated = () => {};
        req.admin = true;
        spyOn(res, 'render').and.callThrough();
        spyOn(req, 'isAuthenticated').and.returnValue(false);
        let userPromise = users.showAll(req, res);
        if (userPromise) userPromise.then(() => {done();});
        else done();
      });

      it('should check of the user is authenticated', () => {
        expect(req.isAuthenticated).toHaveBeenCalled();
      });

      it('should render the noAuth view', () => {
        expect(res.render).toHaveBeenCalledWith('noAuth');
        expect(res.render.calls.mostRecent().args.length).toEqual(1);
      });
    });

    describe('Authenticated, but not admin', () => {
      let req = {}, res = {};
      beforeEach((done) => {
        res.render = () => {};
        req.isAuthenticated = () => {};
        req.admin = false;
        spyOn(res, 'render').and.callThrough();
        spyOn(req, 'isAuthenticated').and.returnValue(true);
        let userPromise = users.showAll(req, res);
        if (userPromise) userPromise.then(() => {done();});
        else done();
      });

      it('should check of the user is authenticated', () => {
        expect(req.isAuthenticated).toHaveBeenCalled();
      });

      it('should render the noAuth view', () => {
        expect(res.render).toHaveBeenCalledWith('noAuth');
        expect(res.render.calls.mostRecent().args.length).toEqual(1);
      });
    });

    describe('Authenticated and admin', () => {
      let req = {}, res = {};
      beforeEach((done) => {
        res.render = () => {};
        req.isAuthenticated = () => {};
        req.admin = true;
        spyOn(res, 'render').and.callThrough();
        spyOn(req, 'isAuthenticated').and.returnValue(true);
        let userPromise = users.showAll(req, res);
        if (userPromise) userPromise.then(() => {done();});
        else done();
      });

      it('should check for authentication', () => {
        expect(req.isAuthenticated).toHaveBeenCalled();
      });

      it('should render the users view', () => {
        expect(res.render.calls.mostRecent().args.length).toEqual(2);
        expect(res.render.calls.mostRecent().args[0]).toEqual('users');
      });

      it('should render the correct data', () => {
        expect(res.render.calls.mostRecent().args.length).toEqual(2);
        expect(res.render.calls.mostRecent().args[0]).toEqual('users');
        jasmine.addCustomEqualityTester(compareUserArrays)
        const usersArray = mockData.getUsersFromExcelFile();
        expect(res.render.calls.mostRecent().args[1].users).toEqual(usersArray);
      });
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
         dbUser.part === (mockUser.part || 'First') &&
         dbUser.SpotId ===  mockUser.SpotId;
}
