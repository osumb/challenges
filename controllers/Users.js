const Models = require('../models');
const Challenge = new Models.Challenge();
const Result = new Models.Result();
const User = new Models.User();

function UsersController() {
  this.showAll = (req, res) => {
    User.findAll()
      .then((users) => {
        res.render('users', { users });
      })
      .catch(() => {
        res.render('error');
      });
  };

  this.showProfile = (req, res) => {
    Promise.all([Result.findAllForUser(req.user.nameNumber), Challenge.findForUser(req.user.nameNumber)])
      .then((data) => {
        const results = data[0], challenge = data[1];

        res.render('userProfile', {
          user: req.user,
          challenge,
          results,
          currentPerformance: req.session.currentPerformance
        });
      })
      .catch(() => res.render('error'));
  };
}

module.exports = UsersController;
