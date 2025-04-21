const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'sql12.freesqldatabase.com',
      user: 'sql12774523',
      password: 'pQQXJPx74e',
      database: 'sql12774523'
    }
  });
  
  module.exports = knex;