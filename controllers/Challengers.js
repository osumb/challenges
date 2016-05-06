'use strict';
const Models = require('../models');
const Challenger = Models.Challenger;
const Spot = Models.Spot;
const sequelize = Models.sequelize;
const User = Models.User;

function ChallengersController() {
  this.new = (req, res) => {
    let success = false;
    return sequelize.transaction((t) => {
      return Spot.findOne({where: {id: req.body['challenge-form']}}, {transaction: t})
        .then((spot) => {
          if (!spotChallenged(spot.dataValues)) {
            success = true;
            return Promise.all([
              Challenger.create({
                PerformanceId: req.user.nextPerformance.id,
                UserNameNumber: req.user.nameNumber,
                SpotId: req.body['challenge-form']
              }),
              spot.update({
                challengedAmount: spot.dataValues.challengedAmount + 1
              }, {fields: ['challengedAmount']}),
              User.update({eligible: false}, {where: {nameNumber: req.user.nameNumber}})
            ]);
          }
        });
    })
    .then(() => {
      if (success) {
        res.render('challengeSuccess');
        req.user.eligible = false;
      }
      else res.render('challengeFailure');
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
