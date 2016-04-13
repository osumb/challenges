const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);
  // 
  // //Performance Controller
  // app.get('/performances', controllers.performance.showAll);
  // app.get('/performances/:performance', controllers.performance.show);
  // app.get('/performances/:performance/challenges', controllers.performance.showChallenges);
  // app.post('/performances', controllers.performance.new);
  //
  // //Challenges Controller
  // app.get('/challenges', controllers.challenges.showAll);
  // app.post('/challenges', controllers.challenges.new);
  //
  // //Users Controller
  // app.get('/users', controllers.users.showAll);
  // app.get('/:nameNumber', controllers.users.show);
  // app.get('/:nameNumber/challenges', controllers.users.showChallenges);

};

module.exports = router;
