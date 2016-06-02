const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const Models = require('../models');
const User = new Models.User();
const bcrypt = require('bcrypt');

passport.use(new Strategy((username, password, done) => {
  User.findByNameNumber(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      if (!user.password && !bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }
      return done(null, User.parse(user));
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
    res.redirect('/noAuth');
  }
}

function ensureAuthAndNameNumberRoute(req, res, next) {
  if (isAuthenticated(req) && req.params.nameNumber === req.user.nameNumber) {
    return next();
  } else {
    res.redirect('/noAuth');
  }
}

function ensureAdmin(req, res, next) {
  if (isAuthenticated(req)) {
    const userIsAdmin = req.user && req.user.admin;
    if (userIsAdmin) {
      return next();
    } else {
      res.redirect('/notAdmin');
    }
  }
}

function ensureEligible(req, res, next) {
  if (isAuthenticated(req) && req.user.eligible) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  ensureAuthAndNameNumberRoute,
  ensureEligible,
  passport
};
