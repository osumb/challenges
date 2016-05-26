const Models = require('../models');
const Challenge = new Models.Challenge();
const Result = new Models.Result();
const User = new Models.User();

function UsersController() {
  this.showAll = (req, res) => {
    const promise = User.findAll();
    promise.then((users) => {
      res.render('users', {users: users});
    });

    promise.catch(() => {
      res.render('error');
    });

    return promise;
  };

  this.showProfile = (req, res) => {
    Promise.all([Result.getAllForUser(req.user.nameNumber), Challenge.getForUser(req.user.nameNumber)])
      .then((data) => {
        const results = data[0], challenge = data[1];

        res.render('userProfile', {user: req.user, challenge, results});
      })
      .catch((err) => {console.error(err); res.render('error');});
  };

  this.showChallengeSelect = (req, res) => {
    const promise = User.findAll(challengeablePeopleQuery(req.user));
    promise.then((challengeableUsers) => {
      res.render('challengeSelect', {user: req.user, challengeableUsers: challengeableUsers});
    });

    promise.catch(() => {
      res.render('error');
    });

    return promise;
  };
}

module.exports = UsersController;
