const fs = require('fs');
const path = require('path');

module.exports = {
  resultsForUser: fs.readFileSync(path.resolve(__dirname, 'results-query.sql')).toString(),
  makeChallenge: fs.readFileSync(path.resolve(__dirname, 'make-challenge-transaction.sql')).toString()
};
