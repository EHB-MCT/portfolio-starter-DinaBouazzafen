const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

module.exports = {
    development: {
      client: 'pg',
      connection: process.env.PG_CONNECTION_STRING,
      seeds: {
        directory: './seeds',
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
      },
    },
};