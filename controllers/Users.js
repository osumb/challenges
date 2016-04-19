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
    if (req.isAuthenticated() && req.user.nameNumber === req.params.nameNumber) {
      const user = req.user || {};
      if (user.nextPerformance) {
        res.render('user', {user: user});
      } else {
        res.render('profile', {user: user});
      }
    } else if (req.isAuthenticated()){
      res.redirect(`/${req.user.nameNumber}`);
    } else {
      res.render('noAuth');
    }
  };

  this.showChallenges = (req, res) => {
    res.send('All challenges for the user');
  };

}

module.exports = UsersController;
