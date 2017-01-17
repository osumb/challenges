const bcrypt = require('bcrypt');

const logger = require('../../utils/logger');
const Challenge = require('../models/challenge-model');
const Manage = require('../models/manage-model');
const Performance = require('../models/performance-model');
const Result = require('../models/result-model');
const Spot = require('../models/spot-model');
const User = require('../models/user-model');

class UsersController {

  static profile({ user }, res, next) {
    Promise.all([
      Challenge.findForUser(user.nameNumber),
      Performance.findCurrent(),
      Result.findAllForUser(user.nameNumber),
      User.findByNameNumber(user.nameNumber)
    ])
    .then(([challenge, performance, results, dbUser]) =>
      Promise.all([challenge, performance, results, dbUser, User.canChallengeForPerformance(user.nameNumber, performance && performance.id)])
    )
    .then(([[challenge], performance, results, dbUser, canChallenge]) => {
      res.locals.jsonResp = {
        admin: dbUser.admin,
        canChallenge,
        challenge: challengeAlreadyInResults(challenge, results) ? null : challenge,
        name: dbUser.name,
        performance: performance && performance.toJSON(),
        results: results.map((result) => result.toJSON(user.nameNumber)),
        spotId: dbUser.spotId
      };
      next();
    })
    .catch((err) => {
      logger.errorLog('Users.profile', err);
      res.status(500).send();
    });
  }

  static userProfileForAdmin({ query }, res, next) {
    Promise.all([
      Challenge.findForUser(query.nameNumber),
      Manage.findAllForUser(query.nameNumber),
      Performance.findCurrent(),
      Result.findForAdminView(query.nameNumber),
      Spot.findByOwnerNameNumber(query.nameNumber),
      User.findByNameNumber(query.nameNumber)
    ])
    .then(([challenges, manageActions, performance, results, [spot], user]) => {
      res.locals.jsonResp = { challenges, manageActions, performance, results, spot, user };
      next();
    })
    .catch((err) => {
      logger.errorLog('Users.profileForAdmin', err);
      res.status(500).send();
    });
  }

  static changePassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;

    if (bcrypt.compareSync(oldPassword, req.user.password)) { // eslint-disable-line no-sync
      User.update(req.user.nameNumber, { new: false, password: newPassword })
      .then(() => {
        res.locals.jsonResp = { success: true };
        next();
      })
      .catch((err) => {
        logger.errorLog('Users.changePassword', err);
        res.locals.jsonResp = { success: false, error: true };
        next();
      });
    } else {
      res.locals.jsonResp = { success: false, error: false };
      next(); // eslint-disable-line callback-return
    }
  }

  static roster(req, res, next) {
    User.indexMembers()
    .then((users) => {
      res.locals.jsonResp = { users };
      next();
    })
    .catch((err) => {
      logger.errorLog('Users.roster', err);
      res.status(500).send();
    });
  }

  static manage(req, res, next) {
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
      res.locals.jsonResp = { success: true };
      next();
    })
    .catch((err) => {
      logger.errorLog('Users.manage', err);
      res.status(500).send();
    });
  }

  static search(req, res, next) {
    User.search(req.query.q)
    .then(users => {
      res.locals.jsonResp = { users };
      next();
    })
    .catch(err => res.status(500).json({ message: err }));
  }

  static update(req, res, next) {
    const { nameNumber } = req.body;

    delete req.body.nameNumber;

    User.update(nameNumber, req.body)
    .then(() => {
      res.locals.jsonResp = { success: true };
      next();
    })
    .catch((err) => {
      logger.errorLog('Users.update', err);
      res.json({ success: false });
    });
  }

}

const challengeAlreadyInResults =
  (challenge, results) => challenge && results.some(({ performanceId }) => challenge.performanceId === performanceId);

module.exports = UsersController;
