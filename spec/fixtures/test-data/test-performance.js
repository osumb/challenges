const moment = require('moment');

const formatString = 'YYYY-MM-DD HH:mm:ss';
module.exports = {
  current: true,
  id: 1,
  name: 'Bowling Green Game',
  openAt: moment().format(formatString),
  closeAt: moment().format(formatString),
  performDate: moment().startOf('day').add({ days: 5, hours: 12 }).format(formatString)
};
