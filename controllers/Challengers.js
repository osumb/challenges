'use strict';
const Models = require('../models');
const Challenger = Models.Challenger;
const Spot = Models.Spot;
const sequelize = Models.sequelize;
const User = Models.User;

function ChallengersController() {
  this.new = (req, res) => {
    let success = false, challengedFullSpot, challengedInvalidPerson;
    return sequelize.transaction((t) => {
      return Promise.all([
        Spot.findOne({where: {id: req.body['challenge-form']}}, {transaction: t}),
        User.findOne({where: {SpotId: req.body['challenge-form']}}, {transaction: t})
      ]).then((results) => {
        challengedFullSpot = spotChallenged(results[0].dataValues);
        challengedInvalidPerson = !validChallenge(req.user, results[1].dataValues, results[0].dataValues.open);
        if (!challengedFullSpot && !challengedInvalidPerson) {
          success = true;
          return Promise.all([
            Challenger.create({
              PerformanceId: req.user.nextPerformance.id,
              UserNameNumber: req.user.nameNumber,
              SpotId: req.body['challenge-form']
            }),
            results[0].update({
              challengedAmount: results[0].dataValues.challengedAmount + 1
            }, {fields: ['challengedAmount']}),
            User.update({eligible: false}, {where: {nameNumber: req.user.nameNumber}})
          ]);
        } else new Promise((resolve) => {resolve();});
      });
    })
    .then(() => {
      if (success) {
        res.render('challengeSuccess', {SpotId: req.body['challenge-form'], user: req.user});
        req.user.eligible = false;
      } else if(challengedFullSpot) {
        res.render('challengeFailure', {message: 'Sorry! That spot has been challenged'});
      } else if(challengedInvalidPerson){
        res.render('challengeFailure', {message: 'Sorry! Your part or instrument doesn\'t match that person'});
      } else {
        res.render('challengeFailure', {message: 'Sorry! You can\'t make that challenge'});
      }
    })
    .catch((e) => {
      console.log(`Error from Challenge creation: ${e}`);
      res.render('error', {error: e});
    });
  };

}

module.exports = ChallengersController;

function spotChallenged(spot) {
  if (spot.open && spot.challengedAmount == 2) return true;
  if (!spot.open && spot.challengedAmount == 1) return true;
  return false;
}

function validChallenge(challenger, challengee, open) {
  const sameInstrument = challenger.instrument == challengee.instrument;
  const samePart = challenger.part == challengee.part;
  const challengeeNotAlternate = !challengee.alternate;
  if (sameInstrument && samePart && challengeeNotAlternate && !open) return true;
  if (sameInstrument && challengeeNotAlternate && open) return true;
  return false;
}
