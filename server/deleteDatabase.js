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
    if(err){
      throw err;
    }

    console.log("MySQL connected");

    // DROP User
    connection.query("DROP TABLE User;", (err) => {
      if(err) throw err;
    });
    console.log("User Dropped");

    // DROP Products 
    connection.query("DROP TABLE Products;", (err) => {
      if(err) throw err;
    });
    console.log("Products Dropped");
  }
  catch(err){
    console.log(err);
  }

  connection.end();
});
