const models = require('../models');
const { logger } = require('../utils');
const Performance = new models.Performance();

function StaticPagesController() {
  this.home = (req, res) => {
    Performance.findNextWithinWindow()
      .then((performance) => res.render('static-pages/home',
        { user: req.user,
          performance: Performance.format(performance, 'MMMM Do, h:mm:ss a')
        }))
      .catch((err) => {
        logger.errorLog({ level: 2, message: `StaticPages.home ${err}` });
        res.render('static-pages/error');
      });
  };

  this.noAuth = (req, res) => {
    res.render('static-pages/no-auth');
  };
}

module.exports = StaticPagesController;
