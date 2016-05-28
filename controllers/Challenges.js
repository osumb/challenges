'use strict';
const models = require('../models');
const Challenge = new models.Challenge();

function ChallengersController() {
  this.new = (req, res) => {
    const userId = req.user.nameNumber,
      spotId = req.body['challenge-form'],
      performanceId = req.params.performanceId;

    Challenge.makeChallenge(userId, spotId, performanceId)
      .then(() => {
        req.user.eligible = false;
        console.log(`${req.user.name} successfully challenged for ${spotId}`); //TODO: logging
        res.render('challengeSuccess', { user: req.user, spotId });
      })
      .catch(() => res.render('challengeFailure'));
  };
}

module.exports = ChallengersController;
