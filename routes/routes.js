const express = require('express');
const router = express.Router();

const auth = require('../auth');
const ensureAdmin = auth.ensureAdmin;
const ensureAuthenticated = auth.ensureAuthenticated;
const ensureAuthAndNameNumberRoute = auth.ensureAuthAndNameNumberRoute;
const ensureEligible = auth.ensureEligible;
const ensureSquadLeaderOrAdmin = auth.ensureSquadLeaderOrAdmin;
const passport = auth.passport;

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);
  app.get('/noAuth', controllers.staticPages.noAuth);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, controllers.performance.showAll);

  //Challengers Controller
  app.post('/challenge', ensureEligible, controllers.challengers.new);
  app.get('/sl/challenges', ensureSquadLeaderOrAdmin, controllers.challengers.showChallengeEvalForm);

  //Sessions Controller
  app.get('/login', controllers.sessions.login);
  app.get('/logout', controllers.sessions.logout);
  app.post('/login', passport.authenticate('local', {failureRedirect: '/login?auth=false'}), controllers.sessions.redirect);

  //Users Controller
  app.get('/users', ensureAdmin, controllers.users.showAll);
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, controllers.users.showProfile);
  app.get('/:nameNumber/makeChallenge', ensureAuthAndNameNumberRoute, controllers.users.showChallengeSelect);

};

module.exports = router;
