const User = require('../models/User');
function UsersController() {
  this.showAll = function(req, res) {
    User.findAll()
      .then((users) => {
        res.render('users', {users: users});
      })
      .catch((e) => {
        res.send(e);
      });
  };
}

module.exports = UsersController;
