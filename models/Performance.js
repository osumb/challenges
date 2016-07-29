const moment = require('moment');

const utils = require('../utils');
const { logger } = require('../utils');

const attributes = ['id', 'name', 'openAt', 'closeAt'];

module.exports = class Performance {

  static getAttributes() {
    return attributes;
  }

  static getIdName() {
    return 'id';
  }

  static getTableName() {
    return 'performances';
  }

  create(name, performDate, openAt, closeAt) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'INSERT INTO performances (name, performDate, openAt, closeAt) VALUES ($1, $2, $3, $4) RETURNING id, closeAt';
      let perfId;

      if (
        Number.isNaN(Date.parse(openAt)) ||
        Number.isNaN(Date.parse(closeAt)) ||
        Number.isNaN(Date.parse(performDate))
      ) {
        reject();
      } else {
        client.connect();
        client.on('error', err => reject(err));

        const query = client.query(queryString, [name, performDate, openAt, closeAt]);

        query.on('row', ({ id }) => {
          perfId = id;
        });

        query.on('end', () => {
          client.end();
          resolve({ id: perfId, utcCloseAt: closeAt });
        });

        query.on('error', (err) => {
          client.end();
          reject(err);
        });
      }
    });
  }

  flagCurrent() {
    const client = utils.db.createClient();
    const sql = 'SELECT flag_current_performance()';

    client.connect();
    client.on('error', (err) => {
      logger.errorLog({ level: 3, message: `Performance.flagCurrent ${err}` });
    });

    const query = client.query(sql);

    query.on('end', () => client.end());
    query.on('error', err => {
      client.end();
      logger.errorLog({ level: 3, message: `Performance.flagCurrent ${err}` });
    });
  }

  findAll(formatString) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances';
      const performances = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString);

      query.on('row', (performance) => {
        performances.push(this.format(performance, formatString));
      });
      query.on('end', () => {
        client.end();
        resolve(performances);
      });
      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    });
  }

  findCurrent() {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances WHERE current LIMIT 1';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString);

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

  findNextWithinWindow() {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances WHERE openAt < $1 AND $2 < closeAt ORDER BY openAt desc LIMIT 1';
      const now = moment.utc(new Date().toJSON());

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [now, now]);

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
    if (!performance) {
      return null;
    }
    formatString = formatString || 'MMMM Do, h:mm:ss a'; // eslint-disable-line no-param-reassign
    const now = moment.utc(new Date().toJSON());
    const windowOpen =
      moment(performance.openat).isBefore(moment(now)) &&
      moment(now).isBefore(moment(performance.closeat));

    return {
      closeAt: moment.utc(performance.closeat).local().format(formatString),
      current: performance.current,
      date: performance.performdate,
      id: performance.id,
      name: performance.name,
      openAt: moment.utc(performance.openat).local().format(formatString),
      windowOpen
    };
  }
};
