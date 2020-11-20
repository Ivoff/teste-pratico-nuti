const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'teste_nuti',    
    port: 5423
})

module.exports = {
    query: (sql, params) => pool.query(sql, params),
    end: () => pool.end()
};