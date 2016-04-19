'use strict';
const path = require('path');
const moment = require('moment');
module.exports = {
  'db': {
    'postgres': process.env.DATABASE_URL || 'postgres://localhost:5432/challenges_dev',
    'userDataPath': path.join(__dirname, '../models/mock-data/UserData.xlsx'),
    'fakeUserDataPath': path.join(__dirname, '../models/mock-data/FakeUsers.xlsx')
  },
  'passport': {
    'secret': process.env.PASSPORT_SECRET || 'keyboard cat'
  },
  'server': {
    'port': process.env.PORT || 3000
  },
  'test': {
    'mockPerformance': {name: 'Bowling Green Game', openAt: moment(buildDate()).add({days: 1}).format(), closeAt: moment(buildDate()).add({days: 1, hours: 3}).format()}
  }
};

function buildDate() {
  let now = new Date();
  let year = now.getFullYear(), month = now.getMonth() + 1, day = now.getUTCDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return new String(year) + '-' + month + '-' + day;
}
