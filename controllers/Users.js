const Models = require('../models');
const Challenge = new Models.Challenge();
const Result = new Models.Result();
const Performance = new Models.Performance();
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
    console.log('Req.keys', Object.keys(req));
    console.log('Session?', req.session);
    Promise.all([Result.getAllForUser(req.user.nameNumber), Challenge.getForUser(req.user.nameNumber)])
      .then((data) => {
        const results = data[0], challenge = data[1];

        res.render('userProfile', {user: req.user, challenge, results});
      })
      .catch(() => res.render('error'));
  };

  this.showChallengeSelect = (req, res) => {
    Promise.all([Challenge.getAllChallengeablePeopleForUser(req.user), Performance.getNext()])
      .then((data) =>
        res.render('challengeSelect', {user: req.user, challengeableUsers: data[0], nextPerformance: data[1]})
      )
      .catch(() => res.render('error'));
  };
}

module.exports = UsersController;
