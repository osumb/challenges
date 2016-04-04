const Challenge = require('../models').Challenge;

function ChallengesController() {
  this.showAll = (req, res) => {
    Challenge.findAll()
      .then((challenges) => {
        res.send(challenges);
      });
  };

  this.new = (req, res) => {
    //TODO create new challenges
    console.log(req.body['challenge-form']);
    res.send(`You challenged: ${req.body['challenge-form']}. Good luck with that one...`);
  };
}

module.exports = ChallengesController;
