const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const auth = require('../auth');
const controllers = require('../controllers');

const {
  ensureAdmin,
  ensureEvalAbility
} = auth;

const Auth = controllers.Auth;
const Challenges = new controllers.Challenges();
const Performances = new controllers.Performances();
const Results = new controllers.Results();
const Users = new controllers.Users();

router.get('/test', ensureAdmin, (req, res) => res.json({ success: true }));

//Auth Controller
router.get('/token', Auth.getToken);

//Challenges Controller
router.post('/performances/challenge', Challenges.create);
router.post('/emailList', ensureAdmin, Challenges.emailList);

//Performance Controller
router.post('/performances/create', ensureAdmin, Performances.create);
// router.put('/performances', ensureAdmin, Performances.update);

//Results Controller
router.post('/performances/results/evaulate', ensureEvalAbility, Results.evaluate);
router.post('/results/approve', ensureAdmin, Results.approve);

//Users Controller
router.get('/:nameNumber', ensureAdmin, Users.show);
router.get('/users/manage', ensureAdmin, Users.showManage);
router.get('/users/manage/:nameNumber', ensureAdmin, Users.showIndividualManage);
router.get('/users/search', ensureAdmin, Users.search);
router.post('/users/manage', ensureAdmin, Users.manage);
router.post('/users/manage/close', ensureAdmin, Users.closeSpot);
router.put('/users', ensureAdmin, Users.update);
router.put('/users/password', Users.changePassword);

module.exports = router;
