const { Pool } = require('pg');
console.log(process.env.DB_HOST);
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 5423
})

module.exports = {
    configuration: pool.options,
    query: (sql, params) => pool.query(sql, params),
    end: () => pool.end()
};