const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const auth = require('../auth');
const controllers = require('../controllers');
const currentPerformance = require('../middleware').currentPerformance;

const ensureAuthenticated = auth.ensureAuthenticated;
const ensureAdmin = auth.ensureAdmin;
const ensureAuthAndNameNumberRoute = auth.ensureAuthAndNameNumberRoute;
const ensureEligible = auth.ensureEligible;
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
  app.post('/challenge/:performanceId', ensureEligible, Challenges.new);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, Performances.showAll);
  app.get('/performances/:performanceId/results', ensureAdmin, Performances.getResults);

  //Results Controller
  app.get('/results/eval', ensureEvalAbility, Results.getForEval);
  app.post('/results/:resultId/eval', ensureEvalAbility, Results.evaluate);

  //Static Pages Controllers
  app.get('/', StaticPages.home);
  app.get('/noAuth', StaticPages.noAuth);

  //Sessions Controller
  app.post('/login', [passport.authenticate('local', { failureRedirect: '/login?auth=false' }), currentPerformance], Sessions.redirect);
  app.get('/login', Sessions.login);
  app.get('/logout', Sessions.logout);

  //Users Controller
  app.get('/users', ensureAdmin, Users.showAll);
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, Users.showProfile);
  app.get('/:nameNumber/makeChallenge', ensureAuthAndNameNumberRoute, Users.showChallengeSelect);

};

module.exports = router;
