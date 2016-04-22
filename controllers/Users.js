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
    const user = req.user || {};
    res.render('userProfile', {user: user});
  };

  this.showChallengeSelect = (req, res) => {
    const user = req.user || {};
    const promise = User.findAll(challengeablePeopleQuery(user));
    promise.then((challengeableUsers) => {
      res.render('challengeSelect', {user: user, challengeableUsers: challengeableUsers});
    });

    promise.catch(() => {
      res.render('error');
    });

    return promise;
  };
}

module.exports = UsersController;
