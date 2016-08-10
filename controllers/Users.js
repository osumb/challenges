const Models = require('../models');
const { logger } = require('../utils');
const Challenge = new Models.Challenge();
const Manage = new Models.Manage();
const Performance = new Models.Performance();
const Result = new Models.Result();
const Spot = new Models.Spot();
const User = new Models.User();

function UsersController() {
  this.closeSpot = (req, res) => {
    const { nameNumber, performanceId, spotId } = req.body;
    const manageAttributes = {
      performanceId,
      userNameNumber: nameNumber,
      reason: 'Closed Spot',
      spotId,
      voluntary: false
    };

    Promise.all([Manage.create(manageAttributes), Spot.setOpenClose(spotId, false), User.setEligibility(nameNumber, false)])
    .then(() => {
      logger.adminActionLog(`close spot (${spotId}) for ${nameNumber} for performance id: ${performanceId}`);
      res.json({ success: true });
    })
    .catch((err) => {
      logger.errorLog('Users.close', err);
      res.status(500).send();
    });
  };

  this.manage = (req, res) => {
    const { nameNumber, performanceId, reason, spotId, voluntary } = req.body;
    const manageAttributes = {
      performanceId,
      userNameNumber: nameNumber,
      reason,
      spotId,
      voluntary
    };

    //If the manage was voluntarily taken by the user (elected to open spot), they're now eligible to challenge
    Promise.all([
      Manage.create(manageAttributes),
      Spot.setOpenClose(spotId, true),
      User.setEligibility(nameNumber, voluntary)
    ])
    .then(() => {
      logger.adminActionLog(`open spot (${spotId}) for ${nameNumber} for performance id: ${performanceId}. reason: ${manageAttributes.reason}`);
      res.json({ success: true });
    })
    .catch((err) => {
      logger.errorLog('Users.manage', err);
      res.status(500).send();
    });
  };

  this.search = (req, res) => {
    User.search(req.query.q)
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err }));
  };

  this.show = (req, res) => {
    const performanceId = req.session.currentPerformance && req.session.currentPerformance.id;

    if (req.user.admin) {
      res.render('users/admin', { user: req.user, currentPerformance: req.session.currentPerformance });
    } else {
      Promise.all([
        Challenge.findForUser(req.user.nameNumber),
        Result.findAllForUser(req.user.nameNumber),
        User.canChallengeForPerformance(req.user, performanceId)
      ])
        .then(data => {
          const canChallenge = data[2], challenge = data[0], results = data[1];

          res.render('users/show', {
            canChallenge,
            challenge,
            results,
            user: req.user
          });
        })
        .catch((err) => {
          logger.errorLog('Users.show', err);
          res.render('static-pages/error');
        });
    }
  };

  this.showIndividualManage = (req, res) => {
    Promise.all([User.findForIndividualManage(req.params.nameNumber), Performance.findAll()])
    .then((data) => {
      res.render('users/individual-manage', {
        managedUserCurrent: data[0][0],
        managedUserOld: data[0].slice(1),
        performances: data[1],
        user: req.user
      });
    })
    .catch((err) => {
      logger.errorLog('Users.showIndividualManage', err);
      res.render('static-pages/error');
    });
  };

  this.showManage = (req, res) => {
    res.render('users/manage', { user: req.user });
  };
}

module.exports = UsersController;
