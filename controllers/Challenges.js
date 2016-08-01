const email = require('../utils').email;
const { logger } = require('../utils');
const models = require('../models');
const Challenge = new models.Challenge();

function ChallengersController() {
  this.create = (req, res) => {
    const userId = req.user.nameNumber,
      spotId = req.body['challenge-form'],
      performanceId = req.params.performanceId;

    logger.challengesLog(`${req.user.name} sent request to challenge ${spotId}`);
    Challenge.create(userId, spotId, performanceId)
      .then(() => {
        req.user.eligible = false;
        email.sendChallengeSuccessEmail({
          nameNumber: 'tareshawty.3', // TODO: actually email the real person
          performanceName: req.session.currentPerformance.name,
          spotId
        });
        logger.challengesLog(`${req.user.name} successfully challenged for ${spotId}`);
        res.render('challenges/success', { user: req.user, spotId });
      })
      .catch((err) => {
        logger.errorLog({ level: 3, message: `Challenges.create ${err}` });
        res.render('challenges/failure', { user: req.user });
      });
  };

  this.new = (req, res) => {
    Challenge.findAllChallengeablePeopleForUser(req.user)
    .then((data) =>
      res.render('challenges/new', {
        user: req.user,
        challengeableUsers: data,
        nextPerformance: req.session.currentPerformance
      })
    )
    .catch((err) => {
      logger.errorLog({ level: 1, message: `Challenges.new ${err}` });
      res.render('static-pages/error');
    });
  };
}

module.exports = ChallengersController;
