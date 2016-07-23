const email = require('../utils').email;
const models = require('../models');
const Challenge = new models.Challenge();

function ChallengersController() {
  this.create = (req, res) => {
    const userId = req.user.nameNumber,
      spotId = req.body['challenge-form'],
      performanceId = req.params.performanceId;

    Challenge.create(userId, spotId, performanceId)
      .then(() => {
        req.user.eligible = false;
        email.sendChallengeSuccessEmail({
          nameNumber: 'tareshawty.3', // TODO: actually email the real person
          performanceName: req.session.currentPerformance.name,
          spotId
        });
        console.log(`${req.user.name} successfully challenged for ${spotId}`); //TODO: logging
        res.render('challenges/success', { user: req.user, spotId });
      })
      .catch((err) => {
        console.error(err);
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
    .catch(() => res.render('static-pages/error'));
  };
}

module.exports = ChallengersController;
