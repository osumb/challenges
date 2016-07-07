const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const auth = require('../auth');
const controllers = require('../controllers');
const middleware = require('../middleware');

const currentPerformance = middleware.currentPerformance;
const ensureAuthenticated = auth.ensureAuthenticated;
const ensureAdmin = auth.ensureAdmin;
const ensureAuthAndNameNumberRoute = auth.ensureAuthAndNameNumberRoute;
const ensureEligible = auth.ensureEligible;
const ensureEvalAbility = auth.ensureEvalAbility;
const passport = auth.passport;
const refreshCurrentPerformance = middleware.refreshCurrentPerformance;

const Challenges = new controllers.Challenges();
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Sessions = new controllers.Sessions();
const StaticPages = new controllers.StaticPages();
const Users = new controllers.Users();

router.setup = (app) => {
  //Challenges Controller
  app.get('/performances/:performanceId/challenges/new', ensureEligible, Challenges.new);
  // app.get('/performances/:performanceId/challenges', ensureAdmin, Challenges.showAll);
  app.post('/performances/:performanceId/challenges', ensureEligible, Challenges.create);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, Performances.showAll);

  //Results Controller
  app.get('/performances/:performanceId/results/evaluate', ensureEvalAbility, Results.showForEvaluation);
  app.get('/performances/:performanceId/results', ensureAdmin, Results.showAll);
  app.post('/performances/:performanceId/results/:resultId', ensureEvalAbility, Results.evaluate);

  //Static Pages Controllers
  app.get('/', refreshCurrentPerformance, StaticPages.home);
  app.get('/noauth', StaticPages.noAuth);

  //Sessions Controller
  app.post('/login', [passport.authenticate('local', { failureRedirect: '/login?auth=false' }), currentPerformance], Sessions.redirect);
  app.get('/login', Sessions.login);
  app.get('/logout', Sessions.logout);

  //Users Controller
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, Users.show);
};

module.exports = router;
