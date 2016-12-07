const email = require('../../utils').email;
const { logger } = require('../../utils');
const models = require('../models');
const Challenge = models.Challenge;
const Performance = models.Performance;
const User = models.User;

function ChallengersController() {

  /*
  * So, this code thing...
  * Basically:
  * 0 - successful challenge
  * 1 - someone already challenged the requested spot
  * 2 - the user requesting to make a challenge already made a challenge
  */
  this.create = (req, res, next) => {
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
              res.locals.jsonResp = {
                code
              };
              next();
            })
            .catch((err) => {
              logger.errorLog('Challenges.create', err);
              res.status(400).send(err);
            });
  };

  this.challengeableUsers = (req, res, next) => {
    Promise.all([Performance.findCurrent(), User.findByNameNumber(req.user.nameNumber)])
    .then(([[performance], user]) => Promise.all([performance, Challenge.findAllChallengeablePeopleForUser(user, performance && performance.id)]))
    .then(([performance, challengeableUsers]) => {
      res.locals.jsonResp = {
        challengeableUsers: (challengeableUsers || []).map((user) => user.toJSON()),
        performanceName: performance && performance.name
      };
      next();
    })
    .catch((err) => {
      logger.errorLog('Challenges.challengeablePeople', err);
      res.status(500).send();
    });
  };
}

module.exports = ChallengersController;
