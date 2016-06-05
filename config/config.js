module.exports = {
  db: {
    postgres: process.env.DATABASE_URL || 'postgres://localhost:5432/challenges_dev'
  },
  passport: {
    secret: process.env.PASSPORT_SECRET || 'keyboard cat'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
