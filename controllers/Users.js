const Models = require('../models');
const Challenge = new Models.Challenge();
const Result = new Models.Result();
const User = new Models.User();

function UsersController() {
  this.show = (req, res) => {
    if (req.user.admin) {
      res.render('users/admin', { user: req.user, currentPerformance: req.session.currentPerformance });
    } else {
      Promise.all([Result.findAllForUser(req.user.nameNumber), Challenge.findForUser(req.user.nameNumber)])
        .then(data => {
          const results = data[0], challenge = data[1];

          res.render('users/show', {
            user: req.user,
            challenge,
            results,
            currentPerformance: req.session.currentPerformance
          });
        })
        .catch(() => res.render('static-pages/error'));
    }
  };

  this.makeIneligible = (req, res) => {
    User.makeIneligible(req.body.nameNumber)
    .then(() => res.json({ success: true }))
    .catch((err) => {
      console.error(err);
      res.json({ success: false });
    });
  };

  this.search = (req, res) => {
    User.search(req.query.q)
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err }));
  };

  this.showManage = (req, res) => {
    res.render('users/manage', { user: req.user });
  };
}

module.exports = UsersController;
