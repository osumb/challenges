function SessionsController() {
  this.login = (req, res) => {
    res.render('login');
  };

  this.redirect = (req, res) => {
    res.redirect(`/${req.user.nameNumber}`);
  };

  this.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
  };
}

module.exports = SessionsController;
