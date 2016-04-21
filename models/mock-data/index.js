'use strict';
const config = require('../../config/config');
const xlsx = require('node-xlsx');

//the order of columns in execl file is Spot, Name, Instrument, Part, Name.#, Eligible, squadLeader, admin
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

const obj = {};
obj.getUsersFromExcelFile = getUsersFromExcelFile;
obj.getSpotsFromExcelFile = getSpotsFromExcelFile;
module.exports = obj;
