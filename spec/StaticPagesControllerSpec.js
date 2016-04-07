'use strict';
const StaticPagesController = require('../controllers/StaticPages');
const staticPages = new StaticPagesController();
describe('Static Pages Controller => ', () => {
  describe('When I make a take test', () => {
    it('should pass!', () => {
      expect(true).toBe(true);
    });
  });

  describe('Home', () => {
    let res = {}, req = {};
    let upcomingGame = {
      performanceName: 'Bowling Green Game',
      openTime: new Date(2016, 2, 23, 13).toLocaleString(),
      closeTime: new Date(2016, 2, 23, 15).toLocaleString()
    };

    beforeEach((done) => {
      res.render = () => {};
      spyOn(res, 'render').and.callThrough();

      let promise = staticPages.home(req, res);
      promise.then(() => {
        done();
      });
    });

    it('should render index with the most recent game', () => {
      expect(res.render).toHaveBeenCalledWith('index', upcomingGame);
    });
  });
});
