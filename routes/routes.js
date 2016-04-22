const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../auth').ensureAuthenticated;
const ensureAdmin = require('../auth').ensureAdmin;
const ensureAuthAndNameNumberRoute = require('../auth').ensureAuthAndNameNumberRoute;

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', ensureAuthenticated, controllers.staticPages.home);
  app.get('/noAuth', controllers.staticPages.noAuth);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, controllers.performance.showAll);

  //Users Controller
  app.get('/users', ensureAdmin, controllers.users.showAll);
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, controllers.users.showProfile);

};

module.exports = router;
