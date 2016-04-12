const Challenge = require('../models').Challenge;
const User = require('../models').User;

function ChallengesController() {
  this.showAll = (req, res) => {
    Challenge.findAll()
      .then((challenges) => {
        res.send(challenges);
      });
  };

  this.showForPerformance = (req, res) => {

  };

  this.showForUser = (req, res) => {

  };

  this.new = (req, res) => {
    //TODO create new challenge for req.user
    const rowFileRegex = /[a-zA-Z]+|[0-9]+/g;
    const spot = req.body['challenge-form'].match(rowFileRegex);
    const row = spot[0];
    const file = spot[1];
    console.log(`${row} ${file}`);
    const challengee = User.findOne({
      where: {
        row,
        file
      }
    });

    challengee.then((person) => {
      res.render('challengeCreated', {
        challengeeName: person.name,
        row: person.row,
        file: person.file
      });
    });
  };
}

module.exports = ChallengesController;
