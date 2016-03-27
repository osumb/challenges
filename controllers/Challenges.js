const Challenge = require('../models').Challenge;

function ChallengesController() {
  this.showAll = (req, res) => {
    Challenge.findAll()
      .then((challenges) => {
        res.send(challenges);
      });
  };
}

module.exports = ChallengesController;
