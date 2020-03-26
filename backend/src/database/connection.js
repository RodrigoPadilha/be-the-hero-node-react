const knex = require('knex')

const configuation = require('../../knexfile');

const connection = knex(configuation.development);  // Conexão definida no arquivo knexfile

module.exports = connection;