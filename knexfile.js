// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/projects',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory:'./db/seeds/dev'
    },
    
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/testprojects',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory:'./db/seeds/test'
    },
    
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
