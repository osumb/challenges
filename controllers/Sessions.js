function SessionsController() {
  this.login = (req, res) => {
    res.render('login');
  };

  this.redirect = (req, res) => {
    res.redirect(`/${req.user.nameNumber}`);
  };
}

module.exports = SessionsController;
