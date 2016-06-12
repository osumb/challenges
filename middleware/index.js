const Models = require('../models');
const Performance = new Models.Performance();

const currentPerformance = (req, res, next) => {

  Performance.findCurrent()
  .then((performance) => {
    req.session.currentPerformance = performance;
    next();
  })
  .catch((err) => {
    console.error('Current Performance Middleware', err);
    next();
  });
};

module.exports = {
  currentPerformance
};
