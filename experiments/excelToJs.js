// Danger ahead... This is really bad, but the future people working on this need explanation
// If you need to pull fake data from the excel spreadsheets into json, use the code below as an example
// Uncomment the necessary getters from spec/fixtures/index.js to grab the fake data from the excel files

// const fs = require('fs');
// const path = require('path');
//
// const fixtures = require('../spec/fixtures');
//
// const fakeUsers = fixtures.utils.getTestUsersFromExcelFile();
//
// fs.writeFileSync(path.resolve(__dirname, '../spec/fixtures/test-data/test-users.js'), 'module.exports = ');
// fs.appendFileSync(path.resolve(__dirname, '../spec/fixtures/test-data/test-users.js'), JSON.stringify(fakeUsers));
