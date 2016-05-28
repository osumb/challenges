const express = require('express');
const router = express.Router();

const auth = require('../auth');
const controllers = require('../controllers');
const ensureAuthenticated = auth.ensureAuthenticated;
const ensureAdmin = auth.ensureAdmin;
const ensureAuthAndNameNumberRoute = auth.ensureAuthAndNameNumberRoute;
const ensureEligible = auth.ensureEligible;
const passport = auth.passport;

router.setup = function(app) {
  //Static Pages Controllers
  app.get('/', new controllers.StaticPages().home);
  app.get('/noAuth', new controllers.StaticPages().noAuth);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, new controllers.Performances().showAll);

  //Challengers Controller
  app.post('/challenge', ensureEligible, new controllers.Challenges().new);

  //Sessions Controller
  app.get('/login', new controllers.Sessions().login);
  app.get('/logout', new controllers.Sessions().logout);
  app.post('/login', passport.authenticate('local', {failureRedirect: '/login?auth=false'}), new controllers.Sessions().redirect);

  //Users Controller
  app.get('/users', ensureAdmin, new controllers.Users().showAll);
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, new controllers.Users().showProfile);
  app.get('/:nameNumber/makeChallenge', ensureAuthAndNameNumberRoute, new controllers.Users().showChallengeSelect);

};

module.exports = router;
