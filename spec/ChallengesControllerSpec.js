'use strict';
const ChallengesController = require('../controllers/Challenges');
const challenges = new ChallengesController();
describe('Challenges Controller => ', () => {
  describe('Show All => ', () => {
    let res = {}, req = {};

    beforeEach(() => {
      res.render = () => {};
      req.isAuthenticated = () => {};
      req.user = {}
      spyOn(res, 'render').and.callThrough();
    });

    describe('User is authenticated and admin => ', () => {
      beforeEach((done) => {
        req.user.admin = true;
        spyOn(req, 'isAuthenticated').and.returnValue(true);
        let promise = challenges.showAll(req, res);
        promise.then(() => {
          done();
        });
      });

      it('should render the challenges view', () => {
        expect(res.render).toHaveBeenCalledWith('challenges', jasmine.any(Object));
      });
    });

    describe('User is authenticated but not an admin => ', () => {
      beforeEach((done) => {
        req.user.admin = false;
        spyOn(req, 'isAuthenticated').and.returnValue(true);
        let promise = challenges.showAll(req, res);
        if (promise) {
          promise.then(() => {
            done();
          });
        } else {
          done();
        }
      });

      it('should not render the challenges view', () => {
        expect(res.render).not.toHaveBeenCalledWith('challenges');
      });

      it('should render the no access page', () => {
        expect(res.render).toHaveBeenCalledWith('notAuthorized');
      })
    });
  });
});
