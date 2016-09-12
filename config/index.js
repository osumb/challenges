let dbURL = 'postgres://localhost:5432/challenges_dev';

if (process.env.NODE_ENV === 'test') {
  dbURL = 'postgres://localhost:5432/challenges_test';
}

module.exports = {
  db: {
    postgres: process.env.DATABASE_URL || dbURL
  },
  passport: {
    secret: process.env.PASSPORT_SECRET || 'keyboard cat'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
