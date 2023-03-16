const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'market_cubos',
    password: 'postgres',
    port: 5432
});

const query = (text, param) => {
    return pool.query(text, param);
}

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Kitanda8841',
        database: 'aula_query_builder'
    }
});

module.exports = {
    query,
    knex
}