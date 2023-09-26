const dotenv = require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const mysql = require('mysql')

module.exports = () => {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })
}