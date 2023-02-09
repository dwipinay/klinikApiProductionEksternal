require('dotenv').config()
const mysql = require('mysql')

const pool_RS_ONLINE = mysql.createPool({
    connectionLimit : 1,
    host            : process.env.DB_HOST_RS_ONLINE,
    user            : process.env.DB_USERNAME_RS_ONLINE,
    password        : process.env.DB_PASSWORD_RS_ONLINE,
    // database        : process.env.DB_DATABASE
})

module.exports = pool_RS_ONLINE