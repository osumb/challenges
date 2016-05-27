const models = require('../models');
const Performance = new models.Performance();

function StaticPagesController() {
  this.home = function(req, res) {
    Performance.getNext()
      .then((performance) => res.render('index',
        { user: req.user,
          performance: Performance.format(performance, 'MMMM Do, h:mm:ss a')
        }))
      .catch((err) => {
        console.error(err);
        res.render('error');
      });
  };

  this.noAuth = function(req, res) {
    res.render('noAuth');
  };
}

module.exports = StaticPagesController;
