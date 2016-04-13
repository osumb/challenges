const express = require('express');
const router = express.Router();

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);


  //Performance Controller
  app.get('/performances', controllers.performance.showAll);
  app.get('/performances/:performance', controllers.performance.show);
  app.post('/performances', controllers.performance.new);

  //Spots Controller
  app.get('/spots', controllers.spots.showAll);

  //Users Controller
  app.get('/users', controllers.users.showAll);
  app.get('/:nameNumber', controllers.users.show);

  //Challengers Controller
  app.post('/:nameNumber/challenges', controllers.challengers.new);

  //Results Controller
  app.get('/:nameNumber/results', controllers.results.showForUser);

};

module.exports = router;
