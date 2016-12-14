const moment = require('moment');

const {
  parseChallengeListFromExcelFile,
  parseResultsFromExcelFile,
  parseSpotsFromExcelFile,
  parseUsersFromExcelFile
} = require('../utils');

const formatString = 'YYYY-MM-DD HH:mm:ss';
const type = 'seed';
const performances = [{
  id: 1,
  name: 'Bowling Green Game',
  openAt: moment().startOf('day').format(formatString),
  closeAt: moment().startOf('day').add({ days: 1, hours: 3 }).format(formatString),
  performDate: moment().startOf('day').add({ weeks: 1 }).format(formatString),
  current: true
}];

module.exports = {
  challengeList: parseChallengeListFromExcelFile(type),
  performances,
  results: parseResultsFromExcelFile(type),
  spots: parseSpotsFromExcelFile(type),
  users: parseUsersFromExcelFile(type)
};
