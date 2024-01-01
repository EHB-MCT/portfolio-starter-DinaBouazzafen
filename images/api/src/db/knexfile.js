module.exports = {
    development: {
      client: 'pg',
      connection: "postgres://admin:test@localhost:5432/db",
      seeds: {
        directory: './seeds',
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
      },
    },
};