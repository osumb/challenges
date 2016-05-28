const moment = require('moment');

const utils = require('../utils');

module.exports = class Performance {
  getNext() {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances WHERE openAt < $1::date ORDER BY openAt desc LIMIT 1';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [new Date().toJSON()]);

      query.on('row', (result) => {
        client.end();
        resolve(result);
      });
      query.on('end', () => {
        client.end();
        resolve(null);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  format(performance, formatString) {
    const now = new Date().toJSON();
    const windowOpen = moment(performance.openat).isBefore(moment(now))
                       && moment(now).isBefore(moment(performance.closeat));

    return {
      id: performance.id,
      name: performance.name,
      openAt: moment(performance.openat).format(formatString),
      closeAt: moment(performance.closeat).format(formatString),
      windowOpen
    };
  }
};
