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
      UserObj.password = bcrypt.hashSync(e[8], bcrypt.genSaltSync(10));
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
      spotObj.challenged = e[2];
      spotArr.push(spotObj);
    }
  });
  return spotArr;
}

function getEligibleChallengers(usersArr) {
  const eligibleChallengers = [];
  usersArr.forEach((e) => {
    if (e.eligible) {
      eligibleChallengers.push(e);
    }
  });
  return eligibleChallengers;
}

const obj = {};
obj.getUsersFromExcelFile = getUsersFromExcelFile;
obj.getSpotsFromExcelFile = getSpotsFromExcelFile;
obj.getEligibleChallengers = getEligibleChallengers;

module.exports = obj;
