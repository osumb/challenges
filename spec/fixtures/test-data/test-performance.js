const moment = require('moment');

const formatString = 'YYYY-MM-DD HH:mm:ss';
module.exports = {
  current: true,
  name: 'Bowling Green Game',
  openAt: moment().format(formatString),
  closeAt: moment().add({ minutes: 5 }).format(formatString),
  performDate: moment().startOf('day').add({ days: 5, hours: 12 }).format(formatString)
};
