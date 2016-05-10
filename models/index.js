'use strict';
const Sequelize = require('sequelize');
const config = require('../config/config');
const sequelize = new Sequelize(config.db.postgres, {logging: false});
const db = {};

//Models
db.User = sequelize.import(__dirname + '/User');
db.Performance = sequelize.import(__dirname + '/Performance');
db.Challenger = sequelize.import(__dirname + '/Challenger');
db.Result = sequelize.import(__dirname + '/Result');
db.Spot = sequelize.import(__dirname + '/Spot');

//Relations
db.Performance.hasMany(db.Challenger);
db.Performance.hasMany(db.Result);
db.User.belongsTo(db.Spot);
db.User.hasMany(db.Challenger);
db.Challenger.belongsTo(db.Spot);
db.Result.belongsTo(db.Spot);
db.Result.belongsTo(db.User, {as: 'first'});
db.Result.belongsTo(db.User, {as: 'second'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.challengeablePeopleQuery = (user) => {
  return {
    where: {
      nameNumber: {
        $ne: user.nameNumber
      },
      instrument: user.instrument,
      part: user.part,
      eligible: false,
      alternate: false
    },
    include: [{
      model: db.Spot,
      where: {
        $or: [
          {
            open: false,
            challengedAmount: {
              $lt: 1
            }
          },
          {
            open: true,
            challengedAmount: {
              $lt: 2
            }
          }
        ]
      }
    }]
  };
};

db.userResultsQuery = (nameNumber) => {
  const queryString = 'SELECT R."firstNameNumber" AS FNN, R."secondNameNumber" AS SNN, U."name" AS uName, R."winnerId", R."comments1", R."comments2", P."name" AS pName, P."id" AS PerformanceId FROM "Results" AS R, "Users" AS U, "Performances" AS P WHERE (R."firstNameNumber" = U."nameNumber" OR R."secondNameNumber" = U."nameNumber") AND (R."firstNameNumber" = $1 OR R."secondNameNumber" = $2) AND R."PerformanceId" = P."id" AND R."pending" = false';
  return {
    queryString,
    bind: [nameNumber, nameNumber]
  };
};

db.nextPerformanceQuery = {
  where: {
    closeAt: {
      $gt: new Date()
    }
  },
  order: [['openAt', 'ASC']]
};

db.openPerformanceWindowQuery = {
  where: {
    openAt: {
      $lt: new Date()
    },
    closeAt: {
      $gt: new Date()
    }
  },
  order: [['openAt', 'ASC']]
};

db.parseResults = (results, nameNumber, name) => {
  const toReturn = [];
  results = splitResults(results, nameNumber, name);
  for (let i = 0; i < results.userResults.length; i++) {
    let result = new Object(), userResult = results.userResults[i], nonUserResult = results.nonUserResults[i];
    result.PerformanceName = userResult.pname;
    result.opponentName = nonUserResult.uname;
    result.comments = userResult.fnn === nameNumber ? userResult.comments1 : userResult.comments2;
    result.winner = userResult.winnerId === nameNumber;
    toReturn.push(result);
  }
  return toReturn;
};

function splitResults(results, userNameNumber, name) {
  const userResults = [], nonUserResults = [];
  results.forEach((e) => {
    if (e.uname === name) userResults.push(e);
    if (e.uname != name) nonUserResults.push(e);
  });
  return {userResults, nonUserResults};
}

module.exports = db;
