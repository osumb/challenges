'use strict';
const path = require('path');
const moment = require('moment');
module.exports = {
  'db': {
    'postgres': process.env.DATABASE_URL || 'postgres://localhost:5432/challenges_dev',
    'userDataPath': path.join(__dirname, '../models/mock-data/UserData.xlsx'),
    'fakeUserDataPath': path.join(__dirname, '../models/mock-data/FakeUsers.xlsx'),
    'fakeSpotDataPath': path.join(__dirname, '../models/mock-data/Spots.xlsx')
  },
  'passport': {
    'secret': process.env.PASSPORT_SECRET || 'keyboard cat'
  },
  'server': {
    'port': process.env.PORT || 3000
  },
  'test': {
    'mockPerformance': {name: 'Bowling Green Game', openAt: moment().startOf('day').add({days: 1}).format(), closeAt: moment().startOf('day').add({days: 1, hours: 3}).format()}
  }
};
