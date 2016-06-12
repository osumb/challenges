const moment = require('moment');

const formatString = 'YYYY-MM-DD HH:mm:ss';
module.exports = [
      {
        name: 'Bowling Green Game',
        openAt: moment().startOf('day').format(formatString),
        closeAt: moment().startOf('day').add({ days: 1, hours: 3 }).format(formatString),
        performDate: moment().startOf('day').add({ weeks: 1 }).format(formatString),
        current: true
      },
      {
        name: 'Buckeye Invite',
        openAt: moment().startOf('month').subtract({ weeks: 1 }).format(formatString),
        closeAt: moment().startOf('momth').subtract({ weeks: 1}).add({ days: 1, hours: 3 }).format(formatString),
        performDate: moment().format(formatString),
        current: false
      }
    ];
