const path = require('path');
const xlsx = require('node-xlsx');
const bcrypt = require('bcrypt');

// the order of columns in execl file is SpotId, name, instrument, part, name.number, role, password
function getMockUsersFromExcelFile(filePath) {
  filePath = filePath || path.resolve(__dirname, '../mock-data/FakeUsers.xlsx');
  const parseObj = xlsx.parse(filePath);
  const userArr = [];
  let UserObj = {};

  console.log(parseObj[0].data);
  parseObj[0].data.forEach((e, index) => {
    //first line of file is column names
    if (index !== 0) {
      UserObj = {};
      UserObj.name = e[1];
      UserObj.spotId = e[0];
      UserObj.instrument = e[2];
      UserObj.part = e[3];
      UserObj.nameNumber = e[4];
      UserObj.role = e[5];
      UserObj.password = bcrypt.hashSync(e[6], bcrypt.genSaltSync(1)); // eslint-disable-line no-sync
      userArr.push(UserObj);
    }
  });
  return userArr;
}

function getTestUsersFromExcelFile(filePath) {
  return getMockUsersFromExcelFile(path.resolve(__dirname, '../test-data/test-users.xlsx'))
}

function getSpotsFromExcelFile(filePath) {
  const path = filePath || config.db.fakeSpotDataPath;
  const parseObj = xlsx.parse(path);
  const spotArr = [];
  let spotObj = {};

  parseObj[0].data.forEach((e, index) => {
    if (index !== 0) {
      spotObj = {};
      spotObj.id = e[0];
      spotObj.open = e[1];
      spotObj.challengedAmount = e[2];
      spotArr.push(spotObj);
    }
  });
  return spotArr;
}

function getTestSpotsFromExcelFile() {
  return getSpotsFromExcelFile(path.resolve(__dirname, '../test-data/test-spots.xlsx'));
}

function getFakeResults(filePath) {
  const path = filePath || config.db.fakeResultsDataPath;
  const parseObj = xlsx.parse(path);
  const resultsArray = [];
  let resultObj;

  parseObj[0].data.forEach((e, i) => {
    if (i !== 0) {
      resultObj = {};
      resultObj.firstNameNumber = e[0];
      resultObj.secondNameNumber = e[1];
      resultObj.PerformanceId = e[2];
      resultObj.SpotId = e[3];
      resultObj.winnerId = e[4];
      resultObj.comments1 = e[5];
      resultObj.comments2 = e[6];
      resultObj.pending = false;
      resultsArray.push(resultObj);
    }
  });
  return resultsArray;
}

function getMockChallengesList(filePath) {
  const path = filePath || config.db.fakeChallengeListPath;
  const parseObj = xlsx.parse(path);
  const challengeList = [];
  let challengeObj = {};

  parseObj[0].data.forEach((e) => {
    challengeObj = {};
    challengeObj.UserNameNumber = e[1];
    challengeObj.PerformanceId = 1;
    challengeObj.SpotId = e[2];
    challengeList.push(challengeObj);
  });
  return challengeList;
}

function getTestChallengesFromExcelFile() {
  return getMockChallengesList(path.resolve(__dirname, '../test-data/test-challenges.xlsx'));
}

module.exports = {
  getMockUsersFromExcelFile,
  getTestChallengesFromExcelFile,
  getTestSpotsFromExcelFile,
  getTestUsersFromExcelFile,
  getSpotsFromExcelFile,
  getMockChallengesList,
  getFakeResults
}
