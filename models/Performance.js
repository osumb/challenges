const utils = require('../utils');

const attributes = ['id', 'name', 'openAt', 'closeAt', 'performDate'];

let cachedCurrentPerformance;

module.exports = class Performance {

  constructor(id, name, openAt, closeAt, performDate) {
    this._id = id;
    this._name = name;
    this._openAt = new Date(openAt);
    this._closeAt = new Date(closeAt);
    this._performDate = new Date(performDate);
  }

  static get Attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'performances';
  }

  static create(name, performDate, openAt, closeAt) {
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
          resolve(new Performance(perfId, name, openAt, closeAt, performDate));
        });

        query.on('error', (err) => {
          client.end();
          reject(err);
        });
      }
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances';
      const performances = [];

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString);

      query.on('row', ({ name, openat, closeat, performdate }) => {
        performances.push(new Performance(name, openat, closeat, performdate));
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

  static findCurrent() {
    if (cachedCurrentPerformance && Date.now() < cachedCurrentPerformance.closeAt) {
      return Promise.resolve(cachedCurrentPerformance);
    }
    return new Promise((resolve, reject) => {
      const client = utils.db.createClient();
      const queryString = 'SELECT * FROM performances WHERE now() < closeAt ORDER BY openAt ASC LIMIT 1';

      client.connect();
      client.on('error', (err) => reject(err));

      const query = client.query(queryString);

      query.on('row', ({ id, name, openat, closeat, performdate }) => {
        client.end();
        resolve(new Performance(id, name, openat, closeat, performdate));
      });

      query.on('end', () => {
        client.end();
        resolve(null);
      });

      query.on('error', (err) => {
        client.end();
        reject(err);
      });
    }).then((currentPerformance) => {
      cachedCurrentPerformance = currentPerformance;
      return currentPerformance;
    });
  }

  get closeAt() {
    return this._closeAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get openAt() {
    return this._openAt;
  }

  inPerformanceWindow() {
    return this._openAt < Date.now() && Date.now() < this._closeAt;
  }

  toJSON() {
    return {
      closeAt: this._closeAt.toISOString(),
      id: this._id,
      name: this._name,
      openAt: this._openAt.toISOString(),
      performDate: this._performDate.toISOString(),
      windowOpen: this.inPerformanceWindow()
    };
  }

};
