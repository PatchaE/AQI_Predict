const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'sql12.freesqldatabase.com',
      user: 'sql12770355',
      password: 'iBUmANq3Ms',
      database: 'sql12770355'
    }
  });
  
  module.exports = knex;