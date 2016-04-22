'use strict';
const StaticPagesController = require('../controllers/StaticPages');
const staticPages = new StaticPagesController();
const mockPerformance = require('../config/config').test.mockPerformance;
const moment = require('moment');
describe('Static Pages Controller => ', () => {
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

    it('should render index', () => {
      expect(res.render).toHaveBeenCalledWith('index', jasmine.any(Object));
    });

    it('should render index with the most recent game', () => {
      const resRenderArgs = res.render.calls.mostRecent().args;
      expect(resRenderArgs.length).toEqual(2);
      expect(resRenderArgs[0]).toEqual('index');
      jasmine.addCustomEqualityTester(performanceCompare);
      expect(resRenderArgs[1]).toEqual(mockPerformance);
    });
  });

  describe('noAuth', () => {
    let req = {}, res = {};
    beforeEach(() => {
      res.render = () => {};
      spyOn(res, 'render').and.callThrough();
      staticPages.noAuth(req, res);
    });

    it('should render noAuth with no other data', () => {
      expect(res.render).toHaveBeenCalledWith('noAuth');
    });
  });
});

function performanceCompare(dbPerformance, mockPerformance) {
  return dbPerformance.performanceName === mockPerformance.name &&
         compareDates(moment(dbPerformance.openAt), moment(mockPerformance.openAt)) &&
         compareDates(moment(dbPerformance.closeAt), moment(mockPerformance.closeAt))
}

function compareDates(a, b) {
  return a.diff(b, 'years') === 0 &&
         a.diff(b, 'months') === 0 &&
         a.diff(b, 'days') === 0 &&
         a.diff(b, 'hours') === 0 &&
         a.diff(b, 'minutes') === 0;
}
