module.exports = {
  db: {
    postgres: process.env.DATABASE_URL || 'postgres://localhost:5432/challenges_dev'
  },
  auth: {
    secret: process.env.SECRET || 'notMuchOfASecret'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
