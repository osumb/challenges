/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');

module.exports = {
  resultsForApproval: fs.readFileSync(path.resolve(__dirname, 'results-for-approval.sql')).toString(),
  resultsForEval: fs.readFileSync(path.resolve(__dirname, 'results-for-eval.sql')).toString(),
  resultsForPerformance: fs.readFileSync(path.resolve(__dirname, 'results-for-performance-query.sql')).toString(),
  resultsForUser: fs.readFileSync(path.resolve(__dirname, 'results-query.sql')).toString()
};
