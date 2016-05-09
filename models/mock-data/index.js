'use strict';
const config = require('../../config/config');
const xlsx = require('node-xlsx');
const bcrypt = require('bcrypt');

//the order of columns in execl file is Spot, Name, Instrument, Part, Name.#, Eligible, squadLeader, admin, password
function getUsersFromExcelFile(filePath) {
  filePath = filePath || config.db.fakeUserDataPath;
  const parseObj = xlsx.parse(filePath);
  const userArr = [];
  let UserObj = {};

  parseObj[0].data.forEach((e, index) => {
    //first line of file is column names
    if (index != 0) {
      UserObj = new Object();
      UserObj.name = e[1];
      UserObj.SpotId = e[0];
      UserObj.instrument = e[2];
      UserObj.part = e[3];
      UserObj.nameNumber = e[4];
      UserObj.eligible = e[5];
      UserObj.squadLeader = e[6];
      UserObj.admin = e[7];
      if (UserObj.SpotId.match(/[A-Z]+|[1-9]+/g)[1] > 12) {
        UserObj.alternate = true;
      } else {
        UserObj.alternate = false;
      }
      UserObj.password = bcrypt.hashSync(e[8], bcrypt.genSaltSync(1));
      userArr.push(UserObj);
    }
  });
  return userArr;
}

function getSpotsFromExcelFile(filePath) {
  filePath = filePath || config.db.fakeSpotDataPath;
  const parseObj = xlsx.parse(filePath);
  const spotArr = [];
  let spotObj = {};
  parseObj[0].data.forEach((e, index) => {
    if (index != 0) {
      spotObj = new Object();
      spotObj.id = e[0];
      spotObj.open = e[1];
      spotObj.challengedAmount = e[2];
      spotArr.push(spotObj);
    }
  });
  return spotArr;
}

function getFakeResults(filePath) {
  filePath = filePath || config.db.fakeResultsDataPath;
  const parseObj = xlsx.parse(filePath);
  const resultsArray = [];
  let resultObj;
  parseObj[0].data.forEach((e, i) => {
    if (i != 0) {
      resultObj = new Object();
      resultObj.firstNameNumber = e[0];
      resultObj.secondNameNumber = e[1];
      resultObj.PerformanceId = e[2];
      resultObj.SpotId = e[3];
      resultObj.winnerId = e[4];
      resultObj.comments1 = e[5];
      resultObj.comments2 = e[6];
      resultsArray.push(resultObj);
    }
  });
  return resultsArray;
}

function separateEligibleMembers(userArr) {
  const eligibleChallengers = [], ineligibleChallengers = [];
  userArr.forEach((e) => {
    if(e.eligible) {
      eligibleChallengers.push(e);
    } else {
      ineligibleChallengers.push(e);
    }
  });
  const returnObj = {eligibleChallengers, ineligibleChallengers};
  return returnObj;
}

function getMockChallengesList(filePath) {
  filePath = filePath || config.db.fakeChallengeListPath;
  const parseObj = xlsx.parse(filePath);
  const challengeList = [];
  let challengeObj = {};
  parseObj[0].data.forEach((e) => {
    challengeObj = new Object();
    challengeObj.UserNameNumber = e[1];
    challengeObj.PerformanceId = 1;
    challengeObj.SpotId = e[2];
    challengeList.push(challengeObj);
  });
  return challengeList;
}

function getNoConflictChallengeList(filePath) {
  filePath = filePath || config.db.fakeNoConflictChallengeListPath;
  return getMockChallengesList(filePath);
}

function getSpotFullChallengeList(filePath) {
  filePath = filePath || config.db.fakeSpotFullChallengeListPath;
  return getMockChallengesList(filePath);
}

function getWrongPersonChallengeList(filePath) {
  filePath = filePath || config.db.wrongPersonChallengeListPath;
  return getMockChallengesList(filePath);
}

const obj = {};
obj.getUsersFromExcelFile = getUsersFromExcelFile;
obj.getSpotsFromExcelFile = getSpotsFromExcelFile;
obj.separateEligibleMembers = separateEligibleMembers;
obj.getMockChallengesList = getMockChallengesList;
obj.getNoConflictChallengeList = getNoConflictChallengeList;
obj.getSpotFullChallengeList = getSpotFullChallengeList;
obj.getWrongPersonChallengeList = getWrongPersonChallengeList;
obj.getFakeResults = getFakeResults;

module.exports = obj;
