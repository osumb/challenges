const models = require('../models');
const { logger } = require('../utils');
const Performance = new models.Performance();

function StaticPagesController() {
  this.home = (req, res) => {
    let message;

    if (req.query.auth === 'false') {
      message = '**Username or password is incorrect**';
    }

    Performance.findNextOrOpenWindow()
      .then((performance) => res.render('static-pages/home',
        {
          message,
          user: req.user,
          performance: Performance.format(performance, 'MMMM Do, h:mm:ss a')
        }))
      .catch((err) => {
        logger.errorLog('StaticPages.home', err);
        res.render('static-pages/error', { user: req.user });
      });
  };
}

module.exports = StaticPagesController;
