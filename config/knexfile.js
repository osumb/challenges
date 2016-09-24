module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'challenges_dev'
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'challenges_test'
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE_URL
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE_URL
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations'
    }
  }
};
