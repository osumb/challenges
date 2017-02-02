const db = require('../../utils/db');
const Model = require('./model');
const { snakeCase } = require('../../utils/object-keys-case-change');

const modelAttributes = ['close_at', 'id', 'list_exported', 'name', 'open_at', 'perform_date'];

class Performance extends Model {

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

    return db.query(sql, [], instanceFromRow);
  }

  static findCurrent() {
    const sql = 'SELECT * FROM performances WHERE now() < close_at ORDER BY open_at ASC LIMIT 1';

    return db.query(sql, [], instanceFromRow)
    .then(([currentPerformance]) => {
      return currentPerformance;
    });
  }

  static findForListExporting() {
    const sql = 'SELECT * from performances WHERE not list_exported AND close_at < now() ORDER BY id asc';

    return db.query(sql, [], instanceFromRow);
  }

  static update(attributes) {
    const id = attributes.id;

    if (typeof id === 'undefined') {
      return Promise.reject(new Error('No id provided with attributes'));
    }

    delete attributes.id;
    const { sql, values } = db.queryBuilder(Performance, snakeCase(attributes), { statement: 'UPDATE', id });

    return db.query(sql, values);
  }

  get closeAt() {
    return new Date(this._closeAt);
  }

  get id() {
    return this._id;
  }

  get listExported() {
    return this._listExported || false;
  }

  get name() {
    return this._name;
  }

  get openAt() {
    return new Date(this._openAt);
  }

  get performDate() {
    return new Date(this._performDate);
  }

  inPerformanceWindow() {
    return new Date(this._openAt) < Date.now() && Date.now() < new Date(this._closeAt);
  }

  toJSON() {
    return {
      closeAt: new Date(this._closeAt).toISOString(),
      id: this._id,
      listExported: this._listExported,
      name: this._name,
      openAt: new Date(this._openAt).toISOString(),
      performDate: new Date(this._performDate).toISOString(),
      windowOpen: this.inPerformanceWindow()
    };
  }

}

const instanceFromRow = (props) => new Performance(props);

const instanceFromRowPerformanceWithoutId = (name, open_at, close_at, perform_date) =>
  ({ id }) => new Performance({ id, listExported: false, name, open_at, close_at, perform_date });

module.exports = Performance;
