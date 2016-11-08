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
      Result.findAllForUser(user.nameNumber),
      User.findByNameNumber(user.nameNumber)
    ])
    .then(([challenge, performances, results, dbUser]) =>
      Promise.all([challenge, performances, results, dbUser, User.canChallengeForPerformance(user, performances[0] && performances[0].id)])
    )
    .then(([[challenge], [performance], results, dbUser, canChallenge]) => {
      console.log(dbUser.admin);
      res.json({
        admin: dbUser.admin,
        canChallenge,
        challenge: !challengeAlreadyInResults(challenge, results) && challenge,
        name: dbUser.name,
        performance: performance && performance.toJSON(),
        results: results.map((result) => result.toJSON()),
        spotId: dbUser.spotId
      });
    })
    .catch((err) => {
      logger.errorLog('Users.profile', err);
      res.status(500).send();
    });
  };

  this.userProfileForAdmin = ({ query }, res) => {
    Promise.all([
      Challenge.findForUser(query.nameNumber),
      Manage.findAllForUser(query.nameNumber),
      Performance.findCurrent(),
      Result.findAllForUser(query.nameNumber),
      Spot.findByOwnerNameNumber(query.nameNumber),
      User.findByNameNumber(query.nameNumber)
    ])
    .then(([challenges, manages, [performance], results, [spot], user]) => {
      res.json({ challenges, manages, performance, results, spot, user });
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

  this.roster = (req, res) => {
    User.indexMembers()
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      logger.errorLog('Users.index', err);
      res.status(500).send();
    });
  };

  this.manage = (req, res) => {
    const { nameNumber, performanceId, reason, spotId, spotOpen, voluntary } = req.body;
    const manageAttributes = {
      performanceId,
      userNameNumber: nameNumber,
      reason,
      spotId,
      voluntary
    };

    Promise.all([Manage.create(manageAttributes), Spot.setOpenClose(spotId, spotOpen)])
    .then(() => {
      logger.adminActionLog(`${spotOpen ? 'open' : 'close'} spot (${spotId}) for ${nameNumber} for performance id: ${performanceId}. reason: ${manageAttributes.reason}`);
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
