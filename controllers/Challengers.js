//const Challenger = require('../models').Challenger;

function ChallengersController() {
  this.new = (req, res) => {
    console.log(req.body);
    res.send('You made a challenge!');
  };
}

module.exports = ChallengersController;
