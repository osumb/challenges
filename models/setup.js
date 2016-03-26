'use strict';
const Performance = require('./Performance');
const User = require('./User');
const config = require('../config');

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
    User.bulkCreate(User.getUsersFromExcelFile(config.db.userDataPath))
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
