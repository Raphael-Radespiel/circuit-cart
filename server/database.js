const dotenv = require("dotenv").config().parsed;

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: dotenv.DB_HOST,
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME
});

connection.connect((err) => {
  try{
    if(err) throw err;
    console.log("MySQL connected");
  }
  catch(err){
    console.log(err);
  }
});

exports.databaseConnection = connection;

