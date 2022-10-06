const mysql = require('mysql2');

const connection = mysql.createConnection({
  /* host: 'localhost',
  user: 'root',
  password: '',
  database : 'db_myapp'   */
  host: 'sql6.freesqldatabase.com',
  user: 'sql6524712',
  password: 'uV9PzGcbHF',
  database: 'sql6524712'
});

connection.connect((err) => {
  if (err) {
    console.log("Error occurred", err);
  } else {
    console.log("Connected to MySQL server");
  }
});

module.exports = connection;