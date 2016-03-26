const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);

  //Performance Controller
  app.get('/performances', controllers.performance.show);

  //Users Controller
  app.get('/users', controllers.users.showAll);
};

module.exports = router;
