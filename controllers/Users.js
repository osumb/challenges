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
    const user = User.findOne({where: {nameNumber: req.params.nameNumber}});
    user.then((user) => {
      const challengeable = User.findAll({
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
      });
      challengeable.then((challengeableUsers) => {
        res.render('user', {user: user, challengeableUsers: challengeableUsers});
      });
    });
  };

  this.showChallenges = (req, res) => {
    res.send('All challenges for the user');
  };
}

module.exports = UsersController;
