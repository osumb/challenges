const bcrypt = require('bcrypt');

const models = require('../models');
const { logger } = require('../utils');
const Challenge = models.Challenge;
const Manage = models.Manage;
const Performance = models.Performance;
const Result = models.Result;
const Spot = models.Spot;
const User = models.User;

function UsersController() {
  this.profile = ({ user }, res) => {
    Promise.all([
      Challenge.findForUser(user.nameNumber),
      Performance.findCurrent(),
      Result.findAllForUser(user.nameNumber)
    ])
    .then(([challenge, performances, results]) =>
      Promise.all([challenge, performances, results, User.canChallengeForPerformance(user, performances[0] && performances[0].id)])
    )
    .then(([[challenge], [performance], results, canChallenge]) => {
      res.json({
        canChallenge,
        challenge: !challengeAlreadyInResults(challenge, results) && challenge,
        results: results.map((result) => result.toJSON()),
        performance: performance && performance.toJSON()
      });
    })
    .catch((err) => {
      logger.errorLog('Users.profile', err);
      res.status(500).send();
    });
  };

  this.changePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (bcrypt.compareSync(oldPassword, req.user.password)) { // eslint-disable-line no-sync
      User.update(req.user.nameNumber, { new: false, password: newPassword })
      .then(([hashPassword]) => {
        req.user.new = false;
        req.user.password = hashPassword;
        res.json({ success: true });
      })
      .catch((err) => {
        logger.errorLog('Users.changePassword', err);
        res.json({ success: false, error: true });
      });
    } else {
      res.json({ success: false, error: false });
    }
  };

  this.closeSpot = (req, res) => {
    const { nameNumber, performanceId, spotId } = req.body;
    const manageAttributes = {
      performanceId,
      userNameNumber: nameNumber,
      reason: 'Closed Spot',
      spotId,
      voluntary: false
    };

    Promise.all([Manage.create(manageAttributes), Spot.setOpenClose(spotId, false)])
    .then(() => {
      logger.adminActionLog(`close spot (${spotId}) for ${nameNumber} for performance id: ${performanceId}`);
      res.json({ success: true });
    })
    .catch((err) => {
      logger.errorLog('Users.close', err);
      res.status(500).send();
    });
  };

  this.indexMembers = (req, res) => {
    User.indexMembers()
    .then((users) => {
      res.render('users/index', { user: req.user, users });
    })
    .catch((err) => {
      logger.errorLog('Users.index', err);
      res.render('static-pages/error', { user: req.user });
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
    Promise.all([Manage.create(manageAttributes), Spot.setOpenClose(spotId, true)])
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

  this.settings = (req, res) => {
    res.render('users/settings', { user: req.user });
  };

  this.showIndividualManage = (req, res) => {
    Promise.all([User.findForIndividualManage(req.params.nameNumber), Performance.findCurrent()])
    .then((data) => {
      res.render('users/individual-manage', {
        managedUserCurrent: data[0][0],
        managedUserOld: data[0].slice(1),
        performance: data[1][0],
        user: req.user
      });
    })
    .catch((err) => {
      logger.errorLog('Users.showIndividualManage', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.showManage = (req, res) => {
    res.render('users/manage', { user: req.user });
  };

  this.update = (req, res) => {
    const { nameNumber } = req.body;

    delete req.body.nameNumber;

    User.update(nameNumber, req.body)
    .then(() => res.json({ success: true }))
    .catch((err) => {
      logger.errorLog('Users.update', err);
      res.json({ success: false });
    });
  };
}

const challengeAlreadyInResults =
  (challenge, results) => challenge && results.some(({ performanceId }) => challenge.performanceId === performanceId);

module.exports = UsersController;
