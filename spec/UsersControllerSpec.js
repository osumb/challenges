'use strict';
const UsersController = require('../controllers/Users');
const mockData = require('../models/mock-data');
const users = new UsersController();
const usersArray = mockData.getUsersFromExcelFile();
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
        jasmine.addCustomEqualityTester(compareUserArrays);
        expect(res.render.calls.mostRecent().args[1].users).toEqual(usersArray);
      });
    });
  });

  //depending on the functionality of users.show, this might be returning a promise
  //not sure yet what the end goal is here, but we'll test the basics for now
  describe('Show', () => {
    describe('Not Authorized', () => {
      let res = {}, req = {};
      beforeEach(() => {
        res.render = () => {};
        req.isAuthenticated = () => {};
        spyOn(res, 'render').and.callThrough();
        spyOn(req, 'isAuthenticated').and.returnValue(false);
      });

      it('should check for authentication', () => {
        users.show(req, res);
        expect(req.isAuthenticated).toHaveBeenCalled();
      });

      it('should render the noAuth view with no other info', () => {
        users.show(req, res);
        expect(res.render).toHaveBeenCalledWith('noAuth');
      });
    });

    describe('Authorized', () => {
      let res = {}, req = {};
      beforeEach(() => {
        req.user = usersArray[0];
        req.params = {};
        res.render = () => {};
        res.redirect = () => {};
        req.isAuthenticated = () => {};
        spyOn(res, 'render').and.callThrough();
        spyOn(req, 'isAuthenticated').and.returnValue(true);
        spyOn(res, 'redirect').and.callThrough();
      });

      it('should check for authentication', (done) => {
        let userPromise = users.show(req, res);
        if (userPromise) userPromise.then(() => {done();});
        else done();
        expect(req.isAuthenticated).toHaveBeenCalled();
      });

      it('shoud not render the user view when the session user does not match the user in the route', () => {
        req.params.nameNumber = req.user.nameNumber + 'bad!';
        users.show(req, res);
        expect(res.render).not.toHaveBeenCalledWith('user');
      });

      it('should redirect the user to the correct route when the session user does not matcht the route', () => {
        req.params.nameNumber = req.user.nameNumber + 'bad!';
        users.show(req, res);
        expect(res.redirect).toHaveBeenCalledWith(`/${req.user.nameNumber}`);
      });

      it('should render the user view', (done) => {
        let userPromise = users.show(req, res);
        if (userPromise) userPromise.then(() => {done();});
        else done();
        expect(res.render).toHaveBeenCalledWith('user', jasmine.any(Object));
      });

      it('should render the user view with the correct user', () => {
        req.params.nameNumber = req.user.nameNumber;
        users.show(req, res);
        expect(res.render).toHaveBeenCalledWith('user', jasmine.any(Object));
        jasmine.addCustomEqualityTester(compareUserValues);
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
