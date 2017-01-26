const email = require('../../utils/email');
const logger = require('../../utils/logger');
const PasswordChangeRequest = require('../models/password-change-request-model');
const User = require('../models/user-model');

class PasswordChangeRequestsController {

  static changePassword({ body }, res, next) {
    const { id, nameNumber, password } = body;

    PasswordChangeRequest.verify(id, nameNumber)
    .then(() => Promise.all([
      User.update(nameNumber, { revokeTokenDate: new Date().toISOString(), password }), // eslint-disable-line quote-props
      PasswordChangeRequest.update(id, { userNameNumber: nameNumber, used: true })
    ]))
    .then(() => {
      res.jsonResp = { success: true };
      next();
    }).catch((err) => {
      console.error(err);
      res.status(403).send('You are unauthorized to make that request');
    });
  }

  static create({ body }, res, next) {
    const { email: userEmail, nameNumber } = body;

    User.verifyEmail(userEmail, nameNumber).then(() => PasswordChangeRequest.create(nameNumber))
    .then((id) => {
      email.sendPasswordRecoveryEmail(userEmail, id)
      .then(() => {
        res.locals.jsonResp = { success: true };
        next();
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(403).send('You are unauthorized to make a request for that email');
    });
  }

  static get({ query }, res, next) {
    const { id } = query;

    PasswordChangeRequest.findById(id)
    .then((request) => {
      res.locals.jsonResp = request && request.toJSON();
      next();
    })
    .catch((err) => {
      logger.errorLog(err);
      res.status(500).send();
    });
  }
}

module.exports = PasswordChangeRequestsController;
