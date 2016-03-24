'use strict';
const Performance = require('./Performance');
const User = require('./User');
const config = require('../config');
const xlsx = require('node-xlsx');
Performance.sync({force: true})
  .then(() => {
    return Performance.create({
      name: 'Bowling Green Game',
      openAt: new Date(2016, 3, 23, 13),
      closeAt: new Date(2016, 3, 23, 14, 15)
    });
  });

User.sync({force: true})
  .then(() => {
    User.bulkCreate(getUsersFromExcelFile(config.db.userDataPath))
      .then(() => {
        return true;
      })
      .then((worked) => {
        console.log(`Did it work? ${worked}`);
      })
      .catch((e) => {
        console.log('We got a problem', e);
      });
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
      UserObj['name.number'] = e[4];
      userArr.push(UserObj);
    }
  });
  return userArr;
}
