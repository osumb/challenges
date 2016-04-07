'use strict';
const config = require('../config/config');
const xlsx = require('node-xlsx');
const models = require('../models');

models.sequelize.sync().then(() => {
  models.Performance.create({name: 'Bowling Green Game', openAt: new Date(2016, 2, 23, 13), closeAt: new Date(2016, 2, 23, 15)});
  models.User.bulkCreate(getUsersFromExcelFile(config.db.userDataPath))
    .then(() => {console.log('\nWe did it!');});
  models.User.create({
    nameNumber: 'hoch.4',
    name: 'Christopher Hoch',
    admin: true
  })
    .then(() => {console.log('Chris Hoch was added');});
});

//the order of columns in execl file is Spot, Name, Instrument, Part, Name.#
//spot comes as 'A1', so we need to split to insert into db
function getUsersFromExcelFile(filePath) {
  const parseObj = xlsx.parse(filePath);
  const rowFileRegex = /[a-zA-Z]+|[0-9]+/g;
  const userArr = [];
  let UserObj = {};

  parseObj[0].data.forEach((e, index) => {
    //first line of file is column names
    if (index != 0) {
      UserObj = new Object();
      let rowFile = e[0].match(rowFileRegex);
      UserObj.name = e[1];
      UserObj.row = rowFile[0];
      UserObj.file = rowFile[1];
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
