let databaseURL = 'postgres://localhost:5432/challenges_dev';

if (process.env.DATABASE_URL) {
  databaseURL = process.env.DATABASE_URL;
} else if (process.env.TRAVIS_DB_NAME) {
  databaseURL = `postgres://${process.env.TRAVIS_DB_NAME}@localhost:5432/challenges_test`;
} else if (process.env.NODE_ENV === 'test') {
  databaseURL = 'postgres://localhost:5432/challenges_test';
}

module.exports = databaseURL;
