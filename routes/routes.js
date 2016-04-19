const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);


  //Performance Controller
  app.get('/performances', controllers.performance.showAll);

  //Users Controller
  app.get('/users', controllers.users.showAll);
  app.get('/:nameNumber', controllers.users.show);

};

module.exports = router;
