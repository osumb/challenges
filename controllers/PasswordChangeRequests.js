const { email, logger } = require('../utils');
const { PasswordChangeRequest, User } = require('../models');

class PasswordChangeRequestsController {

  static changePassword({ body }, res) {
    const { id, nameNumber, password } = body;

    PasswordChangeRequest.verify(id, nameNumber)
    .then(() => Promise.all([
      User.update(nameNumber, { 'revoke_token_date': new Date().toISOString(), password }), // eslint-disable-line quote-props
      PasswordChangeRequest.update(id, { usernamenumber: nameNumber, used: true })
    ]))
    .then(() => {
      res.json({ success: true });
    }).catch((err) => {
      console.log(err);
      res.status(403).send();
    });
  }

  static create({ body }, res) {
    const { email: userEmail, nameNumber } = body;

    User.verifyEmail(userEmail, nameNumber).then(() => PasswordChangeRequest.create(nameNumber))
    .then((id) => {
      email.sendPasswordRecoveryEmail(userEmail, id)
      .then(() => {
        res.json({ success: true });
      });
    })
    .catch(() => {
      res.status(403).send();
    });
  }

  static get({ query }, res) {
    const { id } = query;

    PasswordChangeRequest.findById(id)
    .then(([request]) => {
      res.json({ request });
    })
    .catch((err) => {
      logger.errorLog(err);
      res.status(500).send();
    });
  }
}

module.exports = PasswordChangeRequestsController;
