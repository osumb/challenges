// const pg = require('pg');
// const config = require('../config');
//const client = new pg.Client(config.db.postgres);
const Performance = require('./Performance');
Performance.sync({force: true})
  .then(() => {
    return Performance.create({
      name: 'Bowling Green Game',
      openAt: new Date(2016, 3, 23, 13),
      closeAt: new Date(2016, 3, 23, 14, 15)
    });
  });
