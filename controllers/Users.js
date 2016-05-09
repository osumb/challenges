const Models = require('../models');
const User = Models.User;
const Challenger = Models.Challenger;
const sequelize = Models.sequelize;
const userResultsQuery = Models.userResultsQuery;
const parseResults = Models.parseResults;
const challengeablePeopleQuery = require('../models').challengeablePeopleQuery;

function UsersController() {
  this.showAll = (req, res) => {
    const promise = User.findAll();
    promise.then((users) => {
      res.render('users', {users: users});
    });

    promise.catch(() => {
      res.render('error');
    });

    return promise;
  };

  this.showProfile = (req, res) => {
    const queryObj = userResultsQuery(req.user.nameNumber);
    const promise = Promise.all([
      Challenger.findOne({
        where: {
          PerformanceId: req.user.nextPerformance.id,
          UserNameNumber: req.user.nameNumber
        }
      }),
      sequelize.query(queryObj.queryString, {bind: queryObj.bind})
    ]);
    promise.then((results) => {
      results[0] = results[0] || {dataValues: undefined};
      if (results[1][0].length <= 0) {
        res.render('userProfile', {user: req.user, currentChallenge: results[0].dataValues});
      } else {
        const parsedResults = parseResults(results[1][0], req.user.nameNumber, req.user.name);
        res.render('userProfile', {user: req.user, currentChallenge: results[0].dataValues, results: parsedResults});
      }
    })
    .catch((e) => {
      console.log(e);
      res.render('error');
    });
    return promise;
  };

  this.showChallengeSelect = (req, res) => {
    const promise = User.findAll(challengeablePeopleQuery(req.user));
    promise.then((challengeableUsers) => {
      res.render('challengeSelect', {user: req.user, challengeableUsers: challengeableUsers});
    });

    promise.catch(() => {
      res.render('error');
    });

    return promise;
  };
}

module.exports = UsersController;
