const obj = {};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && (req.isAuthenticated())) {
    return next();
  } else {
    res.redirect('/noAuth');
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

obj.ensureAuthenticated = ensureAuthenticated;
obj.ensureAdmin = ensureAdmin;

module.exports = obj;
