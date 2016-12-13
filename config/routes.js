const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const Challenges = require('../api/controllers/challenges-controller');
const PasswordChangeRequests = require('../api/controllers/password-change-requests-controller');
const Performances = require('../api/controllers/performances-controller');
const Results = require('../api/controllers/results-controller');
const Users = require('../api/controllers/users-controller');

const routes = (auth) => {
  // Get token
  router.post('/token', auth.getTokenForUser);

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
