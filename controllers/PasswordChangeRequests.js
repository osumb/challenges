const { email } = require('../utils');
const { PasswordChangeRequest, User } = require('../models');

class PasswordChangeRequestsController {

  static create({ body }, res) {
    const { email: userEmail, nameNumber } = body;

    Promise.all([User.verifyEmail(userEmail, nameNumber), PasswordChangeRequest.create(nameNumber)])
    .then((data) => {
      email.sendPasswordRecoveryEmail(userEmail, data[1])
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

    res.json({ id });
  }
}

module.exports = PasswordChangeRequestsController;
