const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const { controllers } = require('../api');

const Auth = controllers.Auth;
const Challenges = new controllers.Challenges();
const PasswordChangeRequests = controllers.PasswordChangeRequests;
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Users = new controllers.Users();

const routes = (auth) => {
  //Auth Controller
  router.post('/token', Auth.getToken);

  // Challenges Controller
  router.get('/challengeableUsers', auth.ensureAuthenticated, Challenges.challengeableUsers);
  router.post('/challenges/create', auth.ensureAuthenticated, Challenges.create);

  // PasswordChangeRequests Controller
  router.get('/passwordRequest', PasswordChangeRequests.get);
  router.post('/passwordRequest', PasswordChangeRequests.create);
  router.put('/passwordRequest', PasswordChangeRequests.changePassword);

  // Results Controller
  router.get('/results', auth.ensureAdmin, Results.index);
  router.get('/results/approve', auth.ensureAdmin, Results.getForApproval);
  router.get('/results/evaluate', auth.ensureAdminOrSquadLeader, Results.getForEvaluation);
  router.put('/results/approve', auth.ensureAdmin, Results.approve);
  router.put('/results/evaluate', auth.ensureAdminOrSquadLeader, Results.evaluate);

  // Users Controller
  router.get('/profile', auth.ensureAuthenticated, Users.profile);
  router.get('/roster', auth.ensureAdmin, Users.roster);
  router.get('/users/search', auth.ensureAdmin, Users.search);
  router.get('/users/profile', auth.ensureAdmin, Users.userProfileForAdmin);
  router.post('/users/manage', auth.ensureAdmin, Users.manage);
  router.put('/users', auth.ensureAdmin, Users.update);

  //Performance Controller
  router.post('/performances/create', auth.ensureAdmin, Performances.create);
  // router.put('/performances', auth.ensureAdmin, Performances.update);

  //Users Controller
  router.put('/users/password', Users.changePassword);

  return router;
};

module.exports = routes;
