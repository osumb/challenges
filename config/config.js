const path = require('path');
require('datejs');

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
    'mockPerformance': {name: 'Bowling Green Game', openAt: Date.today().add({days: 1, hours: 13}), closeAt: Date.today().add({days: 1, hours: 15})}
  }
};
