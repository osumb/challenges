const moment = require('moment');

module.exports = {
  current: true,
  id: 1,
  name: 'Bowling Green Game',
  openAt: new Date().toISOString(),
  closeAt: moment().add({ minutes: 1 }).format(),
  performDate: moment().startOf('day').add({ days: 5, hours: 12 }).format()
};
