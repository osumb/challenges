const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const models = require('../models');
const User = models.User;
const bcrypt = require('bcrypt');

passport.use(new Strategy((username, password, done) => {
  User.findByNameNumber(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      if (!bcrypt.compareSync(password, user.password)) { // eslint-disable-line no-sync
        return done(null, false);
      }
      return done(null, user);
    })
    .catch((err) => done(err));
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function isAuthenticated(req) {
  console.log(req.user);
  if (req.isAuthenticated && req.isAuthenticated()) {
    return true;
  } else {
    return false;
  }
}

function ensureAuthenticated(req, res, next) {
  if (isAuthenticated(req)) {
    return next();
  } else {
    return res.render('static-pages/no-auth');
  }
}

function ensureAuthAndNameNumberRoute(req, res, next) {
  if (isAuthenticated(req) && req.params.nameNumber === req.user.nameNumber) {
    return next();
  } else {
    return res.render('static-pages/no-auth');
  }
}

function ensureAdmin(req, res, next) {
  if (isAuthenticated(req)) {
    const userIsAdmin = req.user && req.user.admin;

    if (userIsAdmin) {
      return next();
    } else {
      return res.redirect('/notAdmin');
    }
  }
  return res.render('static-pages/no-auth');
}

function ensureEvalAbility(req, res, next) {
  if (isAuthenticated(req) && (req.user.squadLeader) || req.user.admin) {
    return next();
  } else {
    return res.redirect('/');
  }
}

function ensureNotFirstLogin(req, res, next) {
  if (req.user.new) {
    return res.render('users/settings', {
      message: 'This is your first time logging in. Please make a new password',
      user: req.user
    });
  } else {
    return next();
  }
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  ensureAuthAndNameNumberRoute,
  ensureEvalAbility,
  ensureNotFirstLogin,
  passport
};
