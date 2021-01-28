const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: '192.168.0.3',
  port: 3306,
  user: 'usr_demo',
  password: 'Maria3570!',
  database: 'demo',
  connectionLimit: 10
})

module.exports = pool