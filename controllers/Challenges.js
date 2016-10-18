const email = require('../utils').email;
const emailChallengeList = require('../jobs/email-challenge-list.js');
const { logger } = require('../utils');
const models = require('../models');
const Challenge = models.Challenge;
const Performance = models.Performance;

function ChallengersController() {
  this.create = (req, res) => {
    const { spotId } = req.body;
    const userId = req.user.nameNumber;

    logger.challengesLog(`${req.user.name} request to challenge ${spotId}`);
    return Performance.findCurrent()
            .then(([performance]) => Promise.all([performance, Challenge.create(userId, spotId, performance && performance.id)]))
            .then(([performance, [code]]) => {
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

  this.emailList = ({ body }, res) => {
    emailChallengeList(body.performanceId)
    .then(() => res.json({ success: true }))
    .catch((err) => {
      logger.errorLog('Challenges.emailList', err);
      res.status(500).send(err);
    });
  };

  this.challengeableUsers = (req, res) => {
    Performance.findCurrent()
    .then(([performance]) => Promise.all([performance, Challenge.findAllChallengeablePeopleForUser(req.user, performance && performance.id)]))
    .then(([performance, challengeableUsers]) => {
      res.json({
        challengeableUsers: (challengeableUsers || []).map((user) => user.toJSON()),
        performanceName: performance && performance.name
      });
    })
    .catch((err) => {
      logger.errorLog('Challenges.challengeablePeople', err);
      res.status(500).send();
    });
  };
}

module.exports = ChallengersController;
