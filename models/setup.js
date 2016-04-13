'use strict';
const config = require('../config/config');
const xlsx = require('node-xlsx');
const models = require('../models');

models.sequelize.sync({force: true}).then(() => {
  models.Performance.create({name: 'Bowling Green Game', openAt: new Date(2016, 2, 23, 13), closeAt: new Date(2016, 2, 23, 15)});
  models.Spot.bulkCreate(getSpotsFromExcelFile(config.db.fakeUserDataPath))
    .then(() => {
      console.log('Added Spots');
      models.User.bulkCreate(getUsersFromExcelFile(config.db.fakeUserDataPath)).then(() => {console.log('Added fake data');});
    });
});

//the order of columns in execl file is Spot, Name, Instrument, Part, Name.#
//spot comes as 'A1', so we need to split to insert into db
function getUsersFromExcelFile(filePath) {
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
      //Solo is considered first
      e[3] = (e[3] === 'Solo') ? 'First': e[3];
      UserObj.part = e[3];
      UserObj.nameNumber = e[4];
      userArr.push(UserObj);
    }
  });
  return userArr;
}

function getSpotsFromExcelFile(filePath) {
  const parseObj = xlsx.parse(filePath);
  const spotArr = [];
  let spotObj = {};
  parseObj[0].data.forEach((e, index) => {
    if (index != 0) {
      spotObj = new Object();
      spotObj.id = e[0];
      spotArr.push(spotObj);
    }
  });
  return spotArr;
}


module.exports = getUsersFromExcelFile;
