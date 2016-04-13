//const Challenger = require('../models').Challenger;

function ChallengersController() {
  this.new = (req, res) => {
    res.send('`New Challenger`');
  };
}

module.exports = ChallengersController;
