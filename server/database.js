const dotenv = require("dotenv").config().parsed;

const mysql = require("mysql");

/*
I AM NOW USING RAILWAY SO ILL JUST USE A CONNECTION STRING
const connection = mysql.createConnection({
  host: dotenv.DB_HOST,
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME
});
*/

const connection = mysql.createConnection(dotenv.DB_CONNECTION_STRING);

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

