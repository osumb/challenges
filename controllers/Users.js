const User = require('../models').User;
function challengeableUsersQuery(user) {
  return {
    attributes: ['name', 'row', 'file', 'spotOpen'],
    where: {
      instrument: user.instrument,
      part: user.part,
      challenged: false,
      file: {
        $lt: 13
      },
      nameNumber: {
        $ne: user.nameNumber
      }
    }
  };
}

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

  this.show = (req, res) => {
    const user = req.user || {};
    const challengeable = User.findAll(challengeableUsersQuery(user));

    challengeable.then((challengeableUsers) => {
      res.render('user', {user: user, challengeableUsers: challengeableUsers});
    });

    challengeable.catch(() => {
      res.render('error');
    });

    return challengeable;
  };
}

module.exports = UsersController;
