const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('../models').User;
const bcrypt = require('bcrypt');
const obj = {};

passport.use(new Strategy((username, password, done) => {
  User.findOne({where: {nameNumber: username}})
  .then((user) => {
    if (!user) done(null, false);
    if (!bcrypt.compareSync(password, user.password)) done(null, false);
    done(null, user);
  })
  .catch((err) => {
    done(err);
  });
}));

passport.serializeUser((user, done) => {
  delete user.password;
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && (req.isAuthenticated())) {
    return next();
  } else {
    res.redirect('/noAuth');
  }
}

function ensureAuthAndNameNumberRoute(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.params.nameNumber === req.user.nameNumber) {
    return next();
  } else {
    res.redirect('/noAuth');
    return false;
  }
}

function ensureAdmin(req, res, next) {
  const userIsAdmin = req.user && req.user.admin;
  const isAuthenticated = req.isAuthenticated && req.isAuthenticated();
  if (userIsAdmin && isAuthenticated) {
    return next();
  } else {
    res.redirect('/noAuth');
  }
}

function ensureEligibleForChallenge(req, res, next) {
  if (ensureAuthAndNameNumberRoute(req, res, next) === false) {
    const challengeWindowOpen = req.user.nextPerformance ? req.user.nextPerformance.openAt : undefined;
    const challengeWindowClose = req.user.nextPerformance ? req.user.nextPerformance.closeAt : undefined;
    const withinChallengeWindow = challengeWindowOpen <= new Date() && new Date() <= challengeWindowClose;
    if (!(req.user.eligible && withinChallengeWindow)) {
      res.redirect(`/${req.user.nameNumber}`);
    } else {
      return next();
    }
  } else {
    return false;
  }
}

obj.ensureAuthenticated = ensureAuthenticated;
obj.ensureAdmin = ensureAdmin;
obj.ensureAuthAndNameNumberRoute = ensureAuthAndNameNumberRoute;
obj.passport = passport;
obj.ensureEligibleForChallenge = ensureEligibleForChallenge;


module.exports = obj;
