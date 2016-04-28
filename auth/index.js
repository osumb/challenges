const obj = {};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && (req.isAuthenticated())) {
    return next();
  } else {
    res.redirect('/noAuth');
  }
}

function ensureAuthAndNameNumberRoute(req, res, next) {
  ensureAuthenticated(req, res, next);
  if (req.params.nameNumber === req.user.nameNumber) {
    return next();
  } else {
    res.redirect('/noAuth');
  }
}

function ensureEligibleToChallenge(req, res, next) {
  ensureAuthAndNameNumberRoute(req, res, next);
  if (req.user.eligible) {
    return next();
  } else {
    res.status(401);
  }
}

function ensureAdmin(req, res, next) {
  ensureAuthenticated(req, res, next);
  const userIsAdmin = req.user && req.user.admin;
  if (userIsAdmin) {
    return next();
  } else {
    res.redirect('/noAuth');
  }
}

obj.ensureAuthenticated = ensureAuthenticated;
obj.ensureAdmin = ensureAdmin;
obj.ensureAuthAndNameNumberRoute = ensureAuthAndNameNumberRoute;
obj.ensureEligibleToChallenge = ensureEligibleToChallenge;

module.exports = obj;
