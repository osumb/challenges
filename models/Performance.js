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

  findAll(formatString) {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances';
      const performances = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString, [new Date().toJSON()]);

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
      const now = new Date().toJSON();

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
    const now = new Date().toJSON();
    const windowOpen =
      moment(performance.openat).isBefore(moment(now)) &&
      moment(now).isBefore(moment(performance.closeat));

    return {
      closeAt: moment(performance.closeat).format(formatString),
      current: performance.current,
      date: performance.performdate,
      id: performance.id,
      name: performance.name,
      openAt: moment(performance.openat).format(formatString),
      windowOpen
    };
  }
};
