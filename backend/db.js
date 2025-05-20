const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',         // Replace with your MySQL host
  user: 'sakthi',              // Replace with your MySQL user
  password: 'sakthi',              // Replace with your MySQL password
  database: 'leave_request_system',  // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
