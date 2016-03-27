const User = require('../models').User;
function UsersController() {
  this.showAll = (req, res) => {
    User.findAll()
      .then((users) => {
        res.render('users', {users: users});
      })
      .catch((e) => {
        res.send(e);
      });
  };

  this.show = (req, res) => {
    User.findOne({where: {nameNumber: req.params.nameNumber}})
      .then((user) => {
        res.render('users', {users: [user]});
      });
  };
}

module.exports = UsersController;
