const express = require("express");
const app = express();

const path = require("path");

const dotenv = require("dotenv").config().parsed;

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: dotenv.DB_HOST,
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME
});

connection.connect();

app.use("/", express.static(path.join(__dirname, "../client")));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
})

const { PORT = 5000 } = process.env;

app.listen(PORT, () => {
  console.log(`  App running in port ${PORT}\n`);
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`); 
});

process.on('exit', () => {
  console.log('About to close');
  // THROW ERRORS IN FUNCTION
  connection.end(); 
});
