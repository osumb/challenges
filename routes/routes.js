const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const auth = require('../auth');
const controllers = require('../controllers');
const middleware = require('../middleware');

const currentPerformance = middleware.currentPerformance;
const ensureAuthenticated = auth.ensureAuthenticated;
const ensureAdmin = auth.ensureAdmin;
const ensureAuthAndNameNumberRoute = auth.ensureAuthAndNameNumberRoute;
const ensureEvalAbility = auth.ensureEvalAbility;
const passport = auth.passport;

const Challenges = new controllers.Challenges();
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Sessions = new controllers.Sessions();
const StaticPages = new controllers.StaticPages();
const Users = new controllers.Users();

router.setup = (app) => {
  //Challenges Controller
  app.get('/performances/challenges/new', ensureAuthenticated, Challenges.new);
  app.post('/performances/challenge', ensureAuthenticated, Challenges.create);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, Performances.showAll);
  app.get('/performances/new', ensureAdmin, Performances.new);
  app.post('/performances/create', ensureAdmin, Performances.create);

  //Results Controller
  app.get('/performances/results/evaluate', ensureEvalAbility, Results.showForEvaluation);
  app.get('/performances/results/toapprove', ensureAdmin, Results.getForApproval);
  app.get('/performances/:performanceId/results', ensureAdmin, Results.showAll);
  app.post('/performances/results/evaulate', ensureEvalAbility, Results.evaluate);
  app.post('/results/approve', ensureAdmin, Results.approve);

  //Static Pages Controllers
  app.get('/', StaticPages.home);

  //Sessions Controller
  app.post('/login', [passport.authenticate('local', { failureRedirect: '/login?auth=false' }), currentPerformance], Sessions.redirect);
  app.get('/logout', Sessions.logout);

  //Users Controller
  app.get('/:nameNumber', [ensureAuthAndNameNumberRoute, currentPerformance], Users.show);
  app.get('/users/manage', ensureAdmin, Users.showManage);
  app.get('/users/manage/:nameNumber', ensureAdmin, Users.showIndividualManage);
  app.get('/users/search', ensureAdmin, Users.search);
  app.post('/users/manage', ensureAdmin, Users.manage);
  app.post('/users/manage/close', ensureAdmin, Users.closeSpot);
};

module.exports = router;
