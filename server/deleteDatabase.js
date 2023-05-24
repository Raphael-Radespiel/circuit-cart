const dotenv = require("dotenv").config().parsed;

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: dotenv.DB_HOST,
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME
});

connection.connect((err) => {
  if(err){
    throw err;
  }

  try{
    connection.query("DROP TABLE User;", (err) => {
      if(err) console.log(err);
    });
    connection.query("DROP TABLE Products;", (err) => {
      if(err) console.log(err);
    });
  }
  catch(err){
    console.log(err);
  }
});
