module.exports = {
  db: {
    postgres: process.env.DATABASE_URL || `postgres://${process.env.TRAVIS_DB_NAME ? `${process.env.TRAVIS_DB_NAME}@` : ''}localhost:5432/challenges_dev`
  },
  auth: {
    secret: process.env.SECRET || 'notMuchOfASecret'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
