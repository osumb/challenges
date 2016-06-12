const Models = require('../models');
const Challenge = new Models.Challenge();
const Result = new Models.Result();
const Performance = new Models.Performance();
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

        res.render('userProfile', { user: req.user, challenge, results });
      })
      .catch(() => res.render('error'));
  };

  this.showChallengeSelect = (req, res) => {
    Promise.all([Challenge.findAllChallengeablePeopleForUser(req.user), Performance.findNextWithinWindow()])
      .then((data) =>
        res.render('challengeSelect', { user: req.user, challengeableUsers: data[0], nextPerformance: data[1] })
      )
      .catch(() => res.render('error'));
  };
}

module.exports = UsersController;
