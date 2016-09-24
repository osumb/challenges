const fs = require('fs');
const path = require('path');

const { db } = require('../utils');

const resetFilePath = path.join(__dirname, '/reset.sql');

const resetSQL = fs.readFileSync(resetFilePath, { encoding: 'utf-8' }); //eslint-disable-line no-sync

function resetDB() {
  return db.query(resetSQL);
}

resetDB().then(() => db.closePool())
.catch((err) => {
  db.closePool();
  throw err;
});
