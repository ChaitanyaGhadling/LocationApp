const mysql = require('mysql2');

const connection = mysql.createConnection({
  //host: 'centralized-database.caqfykoqtrvk.us-east-1.rds.amazonaws.com',
  host: 'localhost',
  user: 'root',
  password: '7004',
  database: 'user_location'
});

module.exports = connection;
