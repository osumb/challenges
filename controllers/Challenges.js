const email = require('../utils').email;
const { logger } = require('../utils');
const models = require('../models');
const Challenge = models.Challenge;
const Performance = models.Performance;

function ChallengersController() {
  this.create = (req, res) => {
    const { spotId } = req.body;
    const userId = req.user.nameNumber;

    return Performance.findNextOrOpenWindow()
            .then((performance) => Promise.all([performance, Challenge.create(userId, spotId, performance && performance.id)]))
            .then(([performance, code]) => {
              if (!performance) {
                res.json({ code: 4 });
              }
              if (!code) {
                email.sendChallengeSuccessEmail({
                  email: req.user.email,
                  performanceName: performance.name,
                  spotId
                });
                logger.challengesLog(`${req.user.name} successfully challenged for ${spotId}`);
              } else {
                logger.challengesLog(`${req.user.name} failed to challenge for ${spotId} for code ${code}`);
              }
              res.json({ code });
            })
            .catch((err) => {
              logger.errorLog('Challenges.create', err);
              res.status(400).send(err);
            });
  };

  this.new = (req, res) => {
    Performance.findNextOrOpenWindow()
    .then((performance) => Promise.all([performance, Challenge.findAllChallengeablePeopleForUser(req.user, performance && performance.id)]))
    .then(([performance, challengeableUsers]) => {
      res.render('challenges/new', {
        challengeableUsers: (performance && performance.inPerformanceWindow()) && challengeableUsers,
        performance,
        user: req.user
      });
    })
    .catch((err) => {
      logger.errorLog('Challenges.new', err);
      res.render('static-pages/error', { user: req.user });
    });
  };
}

module.exports = ChallengersController;
