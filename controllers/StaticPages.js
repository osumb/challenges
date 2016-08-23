function StaticPagesController() {
  this.home = (req, res) => {
    if (req.user) {
      res.redirect(`/${req.user.nameNumber}`);
    } else {
      let message;

      if (req.query.auth === 'false') {
        message = '**Username or password is incorrect**';
      }

      res.render('static-pages/home', { message });
    }
  };
}

module.exports = StaticPagesController;
