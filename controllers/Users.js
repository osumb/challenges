const User = require('../models').User;
const challengeablePeopleQuery = require('../models').challengeablePeopleQuery;

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
    res.render('userProfile', {user: req.user});
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
