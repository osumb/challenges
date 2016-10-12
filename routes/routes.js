const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const path = require('path');

const auth = require('../auth');
const controllers = require('../controllers');

const {
  ensureAdmin,
  ensureEvalAbility,
  ensureResultsIndexAbility
} = auth;

const Auth = controllers.Auth;
const Challenges = new controllers.Challenges();
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Users = new controllers.Users();

router.setup = (app) => {

  app.get('/test', ensureAdmin, (req, res) => res.json({ success: true }));

  //Auth Controller
  app.get('/token', Auth.getToken);
  //Challenges Controller
  app.get('/performances/challenges/new', Challenges.new);
  app.post('/performances/challenge', Challenges.create);
  app.post('/emailList', ensureAdmin, Challenges.emailList);

  //Performance Controller
  app.get('/performances', ensureAdmin, Performances.index);
  app.get('/performances/new', ensureAdmin, Performances.new);
  app.post('/performances/create', ensureAdmin, Performances.create);
  // app.put('/performances', ensureAdmin, Performances.update);

  //Results Controller
  app.get('/performances/results/evaluate', ensureEvalAbility, Results.showForEvaluation);
  app.get('/performances/results/toapprove', ensureAdmin, Results.getForApproval);
  app.get('/results', ensureResultsIndexAbility, Results.index);
  app.post('/performances/results/evaulate', ensureEvalAbility, Results.evaluate);
  app.post('/results/approve', ensureAdmin, Results.approve);

  //Static Pages Controllers
  app.get('/', (res, response) => response.sendFile(path.resolve(__dirname, '../dist/index.html')));

  //Users Controller
  app.get('/users', ensureAdmin, Users.indexMembers);
  app.get('/:nameNumber', ensureAdmin, Users.show);
  app.get('/:nameNumber/settings', Users.settings);
  app.get('/users/manage', ensureAdmin, Users.showManage);
  app.get('/users/manage/:nameNumber', ensureAdmin, Users.showIndividualManage);
  app.get('/users/search', ensureAdmin, Users.search);
  app.post('/users/manage', ensureAdmin, Users.manage);
  app.post('/users/manage/close', ensureAdmin, Users.closeSpot);
  app.put('/users', ensureAdmin, Users.update);
  app.put('/users/password', Users.changePassword);

};

module.exports = router;
