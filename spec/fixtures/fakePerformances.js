const moment = require('moment');

module.exports = [
      { name: 'Bowling Green Game', openAt: moment().startOf('day').add().format('YYYY-MM-DD HH:mm:ss'), closeAt: moment().startOf('day').add({ days: 1, hours: 3 }).format('YYYY-MM-DD HH:mm:ss') },
      { name: 'Buckeye Invite', openAt: moment().startOf('month').add().format('YYYY-MM-DD HH:mm:ss'), closeAt: moment().startOf('month').add({ days: 1, hours: 3 }).format('YYYY-MM-DD HH:mm:ss') }
    ];
