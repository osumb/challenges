const User = require('../models').User;

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
}

module.exports = UsersController;
