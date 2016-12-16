const db = require('../../utils/db');

const modelAttributes = ['close_at', 'id', 'list_exported', 'name', 'open_at', 'perform_date'];

let cachedCurrentPerformance;

class Performance {

  constructor(id, listExported, name, openAt, closeAt, performDate) {
    this._id = id;
    this._listExported = listExported;
    this._name = name;
    this._openAt = new Date(openAt);
    this._closeAt = new Date(closeAt);
    this._performDate = new Date(performDate);
  }

  static get attributes() {
    return modelAttributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'performances';
  }

  static create(name, performDate, openAt, closeAt) {
    const sql = 'INSERT INTO performances (name, perform_date, open_at, close_at) VALUES ($1, $2, $3, $4) RETURNING id, close_at';

    if (
      Number.isNaN(Date.parse(openAt)) ||
      Number.isNaN(Date.parse(closeAt)) ||
      Number.isNaN(Date.parse(performDate))
    ) {
      return Promise.reject();
    } else {
      return db.query(
        sql,
        [name, performDate, openAt, closeAt],
        instanceFromRowPerformanceWithoutId(name, openAt, closeAt, performDate)
      );
    }
  }

  static findAll() {
    const sql = 'SELECT * FROM performances ORDER BY id';

    return db.query(sql, [], instanceFromRowPerformance);
  }

  static findCurrent() {
    if (cachedCurrentPerformance && Date.now() < cachedCurrentPerformance.closeAt) {
      return Promise.resolve(cachedCurrentPerformance);
    }
    const sql = 'SELECT * FROM performances WHERE now() < close_at ORDER BY open_at ASC LIMIT 1';

    return db.query(sql, [], instanceFromRowPerformance)
    .then(([currentPerformance]) => {
      cachedCurrentPerformance = currentPerformance;
      return currentPerformance;
    });
  }

  static findForListExporting() {
    const sql = 'SELECT * from performances WHERE not list_exported AND close_at < now() ORDER BY id asc';

    return db.query(sql, [], instanceFromRowPerformance);
  }

  static update(attributes) {
    const id = attributes.id;

    if (typeof id === 'undefined') {
      return Promise.reject(new Error('No id provided with attributes'));
    }

    delete attributes.id;
    const { sql, values } = db.queryBuilder(Performance, attributes, { statement: 'UPDATE', id });

    return db.query(sql, values);
  }

  get closeAt() {
    return this._closeAt;
  }

  get id() {
    return this._id;
  }

  get listExported() {
    return this._listExported;
  }

  get name() {
    return this._name;
  }

  get openAt() {
    return this._openAt;
  }

  get performDate() {
    return this._performDate;
  }

  inPerformanceWindow() {
    return this._openAt < Date.now() && Date.now() < this._closeAt;
  }

  toJSON() {
    return {
      closeAt: this._closeAt.toISOString(),
      id: this._id,
      listExported: this._listExported,
      name: this._name,
      openAt: this._openAt.toISOString(),
      performDate: this._performDate.toISOString(),
      windowOpen: this.inPerformanceWindow()
    };
  }

}

const instanceFromRowPerformance = ({ id, list_exported, name, open_at, close_at, perform_date }) =>
  new Performance(id, list_exported, name, open_at, close_at, perform_date);

const instanceFromRowPerformanceWithoutId = (name, open_at, close_at, perform_date) =>
  ({ id }) => new Performance(id, false, name, open_at, close_at, perform_date);

module.exports = Performance;
