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
    let userPromise;
    if (req.isAuthenticated()) {
      userPromise = User.findOne({where: {'nameNumber': req.user.nameNumber}});
    } else {
      res.render('noAuth');
    }
    const user = req.user || {};
    res.render('user', {user: user});
    return userPromise;
  };

  this.showChallenges = (req, res) => {
    res.send('All challenges for the user');
  };

}

module.exports = UsersController;
