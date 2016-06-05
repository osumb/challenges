/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');

module.exports = {
  resultsForPerformance: fs.readFileSync(path.resolve(__dirname, 'results-for-performance-query.sql')).toString(),
  resultsForUser: fs.readFileSync(path.resolve(__dirname, 'results-query.sql')).toString()
};
