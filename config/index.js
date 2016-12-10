const routes = require('./routes');

module.exports = {
  auth: {
    secret: process.env.SECRET || 'notMuchOfASecret'
  },
  db: {
    postgres: process.env.DATABASE_URL || `postgres://${process.env.TRAVIS_DB_NAME ? `${process.env.TRAVIS_DB_NAME}@` : ''}localhost:5432/challenges_dev`
  },
  routes,
  server: {
    port: process.env.SERVER_PORT || 3000
  }
};
