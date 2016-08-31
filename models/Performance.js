const moment = require('moment');

const utils = require('../utils');

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

  findNextOrOpenWindow() {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances WHERE now() < openAt OR (openAt < now() AND now() < closeAt) ORDER BY openAt DESC LIMIT 1';

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

  format(performance, formatString) {
    if (!performance) {
      return null;
    }
    const windowOpen = this.inPerformanceWindow(performance);

    return {
      closeAt: moment.utc(performance.closeat).format(formatString),
      current: performance.current,
      date: performance.performdate,
      id: performance.id,
      name: performance.name,
      openAt: moment.utc(performance.openat).format(formatString),
      windowOpen
    };
  }

  inPerformanceWindow(performance) {
    if (!performance) {
      return false;
    }
    const now = moment.utc(new Date().toJSON());

    return moment(new Date(performance.openat)).isBefore(moment(now)) && moment(now).isBefore(moment(new Date(performance.closeat)));
  }
};
