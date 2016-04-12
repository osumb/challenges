'use strict';
const UsersController = require('../controllers/Users');
const users = new UsersController();
describe('Users Controller => ', () => {
  let res = {}, req = {};
  beforeEach(() => {
    res.render = () => {};
    spyOn(res, 'render').and.callThrough();
  });

  describe('Show All', () => {
    beforeEach((done) => {
      let promise = users.showAll(req, res);
      promise.then(() => {
        done();
      });
    });

    it('should render users with some object', () => {
      expect(res.render).toHaveBeenCalledWith('users', jasmine.any(Object));
    });
  });

  describe('Show', () => {
    beforeEach((done) => {
      req.params = {};
      req.params.nameNumber = 'name.number';
      req.user = {
        instrument: 'Mellophone',
        part: 'First',
        nameNumber: 'name.number'
      };

      let promise = users.show(req, res);
      promise.then(() => {
        done();
      });
    });

    it('should render the user page', () => {
      expect(res.render).toHaveBeenCalledWith('user', jasmine.any(Object));
    });

    it('should render the user page with a user object and challengeableUsers', () => {
      const renderObj = {
        user: jasmine.any(Object),
        challengeableUsers: jasmine.any(Object)
      };
      expect(res.render).toHaveBeenCalledWith('user', renderObj);
    });
  });
});
