/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');

module.exports = {
  canChallengeForPerformance: fs.readFileSync(path.resolve(__dirname, 'can-challenge-for-performance.sql')).toString(),
  challengeablePeople: fs.readFileSync(path.resolve(__dirname, 'challengeable-people.sql')).toString(),
  challengesForCSV: fs.readFileSync(path.resolve(__dirname, 'challenges-for-csv.sql')).toString(),
  findForIndividualManage: fs.readFileSync(path.resolve(__dirname, 'find-for-individual-manage.sql')).toString(),
  resultsForApproval: fs.readFileSync(path.resolve(__dirname, 'results-for-approval.sql')).toString(),
  resultsForEval: fs.readFileSync(path.resolve(__dirname, 'results-for-eval.sql')).toString(),
  resultsForPerformance: fs.readFileSync(path.resolve(__dirname, 'results-for-performance-query.sql')).toString(),
  resultsForUser: fs.readFileSync(path.resolve(__dirname, 'results-query.sql')).toString(),
  resultsIndex: fs.readFileSync(path.resolve(__dirname, 'results-index.sql')).toString()
};
