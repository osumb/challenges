function SessionsController() {
  this.login = (req, res) => {
    let message;

    //query.auth is a string, not a bool...
    if (req.query.auth === 'false') {
      message = 'Username or password is incorrect';
    }
    res.render('login', { message });
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
