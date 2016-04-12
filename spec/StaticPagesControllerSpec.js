'use strict';
const StaticPagesController = require('../controllers/StaticPages');
const staticPages = new StaticPagesController();
describe('Static Pages Controller => ', () => {
  describe('When I make a fake test', () => {
    it('should pass!', () => {
      expect(true).toBe(true);
    });
  });

  describe('Home', () => {
    let res = {}, req = {};

    beforeEach((done) => {
      res.render = () => {};
      spyOn(res, 'render').and.callThrough();

      let promise = staticPages.home(req, res);
      promise.then(() => {
        done();
      });
    });

    it('should render index with the most recent game', () => {
      expect(res.render).toHaveBeenCalledWith('index', jasmine.any(Object));
    });
  });
});
