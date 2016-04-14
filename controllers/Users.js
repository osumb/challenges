'use strict';
const User = require('../models').User;

function UsersController() {
  this.showAll = (req, res) => {
    let promise;
    if (req.isAuthenticated() && req.admin) {
      promise = User.findAll();
      promise.then((users) => {
        res.render('users', {users: users});
      });

      promise.catch(() => {
        res.render('error');
      });
    } else {
      res.render('noAuth');
    }

    return promise;
  };

  this.show = (req, res) => {
    const user = req.user || {};
    res.render('user', {user: user});
  };

  this.showChallenges = (req, res) => {
    res.send('All challenges for the user');
  };
}

module.exports = UsersController;
