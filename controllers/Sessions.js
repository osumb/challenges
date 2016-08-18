function SessionsController() {
  this.redirect = (req, res) => {
    res.redirect(`/${req.user.nameNumber}`);
  };

  this.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
  };
}

module.exports = SessionsController;
