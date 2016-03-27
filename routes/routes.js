const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);

  //Performance Controller
  app.get('/performances', controllers.performance.show);

  //Users Controller
  app.get('/users', controllers.users.showAll);
  app.get('/users/:nameNumber', controllers.users.show);

  //Challenges Controller
  app.get('/challenges', controllers.challenges.showAll);
};

module.exports = router;
