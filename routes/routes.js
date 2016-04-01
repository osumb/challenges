const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);

  //Performance Controller
  app.get('/performances', controllers.performance.show);

  //Challenges Controller
  app.get('/challenges', controllers.challenges.showAll);
  app.get('/challenges/:performance', controllers.challenges.showForPerformance);
  app.get('/:nameNumber/challenges', controllers.challenges.showForUser);
  app.post('/challenges', controllers.challenges.new);

  //Users Controller
  app.get('/users', controllers.users.showAll);
  app.get('/:nameNumber', controllers.users.show);

};

module.exports = router;
