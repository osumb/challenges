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
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Users = new controllers.Users();

//Auth Controller
router.get('/token', Auth.getToken);

// Challenges Controller
router.get('/challengeableUsers', ensureAuthenticated, Challenges.challengeableUsers);
router.post('/challenges/create', ensureAuthenticated, Challenges.create);

// Results Controller
router.get('/results', ensureAdmin, Results.index);
router.get('/results/approve', ensureAdmin, Results.getForApproval);
router.get('/results/evaluate', ensureAdminOrSquadLeader, Results.getForEvaluation);
router.put('/results/approve', ensureAdmin, Results.approve);
router.put('/results/evaluate', ensureAdminOrSquadLeader, Results.evaluate);

// Users Controller
router.get('/profile', ensureAuthenticated, Users.profile);



//Challenges Controller
router.post('/performances/challenge', Challenges.create);
router.post('/emailList', ensureAdmin, Challenges.emailList);

//Performance Controller
router.post('/performances/create', ensureAdmin, Performances.create);
// router.put('/performances', ensureAdmin, Performances.update);

//Users Controller
router.get('/users/manage', ensureAdmin, Users.showManage);
router.get('/users/manage/:nameNumber', ensureAdmin, Users.showIndividualManage);
router.get('/users/search', ensureAdmin, Users.search);
router.post('/users/manage', ensureAdmin, Users.manage);
router.post('/users/manage/close', ensureAdmin, Users.closeSpot);
router.put('/users', ensureAdmin, Users.update);
router.put('/users/password', Users.changePassword);

module.exports = router;
