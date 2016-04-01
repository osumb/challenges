const Challenge = require('../models').Challenge;

function ChallengesController() {
  this.showAll = (req, res) => {
    Challenge.findAll()
      .then((challenges) => {
        res.send(challenges);
      });
  };

  this.showForUser = (req, res) => {
    //TODO find all challenges based on req.params.nameNumber
    res.send('Your challenges');
  };

  this.showForPerformance = (req, res) => {
    //TODO get all challenges based on req.params.performance
    //admin eyes only!
    res.send('All challenges for {{performance}}');
  };

  this.new = (req, res) => {
    //TODO create new challenges
    console.log(req.body['challenge-form']);
    res.send(`You challenged: ${req.body['challenge-form']}. Good luck with that one...`);
  };
}

module.exports = ChallengesController;
