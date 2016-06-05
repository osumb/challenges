const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const auth = require('../auth');
const controllers = require('../controllers');
const currentPerformance = require('../middleware').currentPerformance;

const ensureAuthenticated = auth.ensureAuthenticated;
const ensureAdmin = auth.ensureAdmin;
const ensureAuthAndNameNumberRoute = auth.ensureAuthAndNameNumberRoute;
// const ensureSL = auth.ensureSL;
const ensureEligible = auth.ensureEligible;
const passport = auth.passport;

const Challenges = new controllers.Challenges();
const Performances = new controllers.Performances();
const Sessions = new controllers.Sessions();
const StaticPages = new controllers.StaticPages();
const Users = new controllers.Users();

router.setup = (app) => {
  //Static Pages Controllers
  app.get('/', StaticPages.home);
  app.get('/noAuth', StaticPages.noAuth);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, Performances.showAll);
  app.get('/performances/:performanceId/results', ensureAdmin, Performances.getResults);
  app.get('/performances/:performanceId/eval', /*ensureSL, */Performances.getForEval);

  //Challengers Controller
  app.post('/challenge/:performanceId', ensureEligible, Challenges.new);

  //Sessions Controller
  app.post('/login', [passport.authenticate('local', { failureRedirect: '/login?auth=false' }), currentPerformance],  Sessions.redirect);
  app.get('/login', Sessions.login);
  app.get('/logout', Sessions.logout);

  //Users Controller
  app.get('/users', ensureAdmin, Users.showAll);
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, Users.showProfile);
  app.get('/:nameNumber/makeChallenge', ensureAuthAndNameNumberRoute, Users.showChallengeSelect);

};

module.exports = router;
