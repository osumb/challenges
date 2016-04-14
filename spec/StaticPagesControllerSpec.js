'use strict';
const StaticPagesController = require('../controllers/StaticPages');
const staticPages = new StaticPagesController();
const mockPerformance = require('../config/config').test.mockPerformance;
const moment = require('moment');
describe('Static Pages Controller => ', () => {
  describe('Home', () => {
    describe('Authenticated', () => {
      let res = {}, req = {};

      beforeEach((done) => {
        res.render = () => {};
        req.isAuthenticated = () => {};
        spyOn(res, 'render').and.callThrough();
        spyOn(req, 'isAuthenticated').and.returnValue(true);
        let promise = staticPages.home(req, res);
        promise.then(() => {
          done();
        });
      });

      it('should check to see if the user is authenticated', () => {
        expect(req.isAuthenticated).toHaveBeenCalled();
      });

      it('should render index with the most recent game', () => {
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

  });
});

function performanceCompare(dbPerformance, mockPerformance) {
  return dbPerformance.performanceName === mockPerformance.name &&
         compareDates(moment(dbPerformance.openTime), moment(mockPerformance.openAt)) &&
         compareDates(moment(dbPerformance.closeTime), moment(mockPerformance.closeAt))
}

function compareDates(a, b) {
  return a.diff(b, 'years') === 0 &&
         a.diff(b, 'months') === 0 &&
         a.diff(b, 'days') === 0 &&
         a.diff(b, 'hours') === 0 &&
         a.diff(b, 'minutes') === 0;
}
