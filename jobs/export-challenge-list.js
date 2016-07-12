/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');

const challengesToCSV = require('../utils').challengesToCSV;
const models = require('../models');
const Challenge = new models.Challenge();

Challenge.findAllForPerformanceCSV(1)
.then(challengesToCSV)
.then(challengeList => {
  const filePath = path.resolve(__dirname, 'challengeList.csv');

  fs.closeSync(fs.openSync(filePath, 'w'));
  challengeList.forEach(challenge => {
    fs.appendFileSync(filePath, `${challenge.join(',')}\n`);
  });
})
.catch(console.error);
