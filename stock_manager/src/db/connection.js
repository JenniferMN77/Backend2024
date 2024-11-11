const mariadb = require('mariadb');

const config = {
    host: 'localhost',
    user: 'mariabd_user',
    password: 'abc123t',
    database: 'stockdb',
    port: 3306,
    connectionLimit: 10
};

const pool  = mariadb.createPool(config);

module.exports = pool;
