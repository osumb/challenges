function StaticPagesController() {
  this.home = function(req, res) {
    res.render('index', {title: 'OSUMB Challenges', name: 'World'});
  }
}

module.exports = StaticPagesController;
