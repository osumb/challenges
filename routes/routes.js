const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const auth = require('../auth');
const controllers = require('../controllers');

const {
  ensureAdmin,
  ensureAdminOrSquadLeader,
  ensureAuthenticated
} = auth;

const Auth = controllers.Auth;
const Challenges = new controllers.Challenges();
const PasswordChangeRequestsController = controllers.PasswordChangeRequestsController;
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Users = new controllers.Users();

//Auth Controller
router.get('/token', Auth.getToken);

// Challenges Controller
router.get('/challengeableUsers', ensureAuthenticated, Challenges.challengeableUsers);
router.post('/challenges/create', ensureAuthenticated, Challenges.create);

// PasswordChangeRequests Controller
router.get('/passwordRequest', PasswordChangeRequestsController.get);
router.post('/passwordRequest', PasswordChangeRequestsController.create);
router.put('/passwordRequest', PasswordChangeRequestsController.changePassword);

// Results Controller
router.get('/results', ensureAdmin, Results.index);
router.get('/results/approve', ensureAdmin, Results.getForApproval);
router.get('/results/evaluate', ensureAdminOrSquadLeader, Results.getForEvaluation);
router.put('/results/approve', ensureAdmin, Results.approve);
router.put('/results/evaluate', ensureAdminOrSquadLeader, Results.evaluate);

// Users Controller
router.get('/profile', ensureAuthenticated, Users.profile);
router.get('/roster', ensureAdmin, Users.roster);
router.get('/users/search', ensureAdmin, Users.search);
router.get('/users/profile', ensureAdmin, Users.userProfileForAdmin);
router.post('/users/manage', ensureAdmin, Users.manage);
router.put('/users', ensureAdmin, Users.update);

//Performance Controller
router.post('/performances/create', ensureAdmin, Performances.create);
// router.put('/performances', ensureAdmin, Performances.update);

//Users Controller
router.put('/users/password', Users.changePassword);

module.exports = router;
