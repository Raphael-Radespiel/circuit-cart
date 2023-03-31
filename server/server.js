const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");

const connection = require("./database").databaseConnection;

// ROUTES
const randomProductsRoute = require('./routes/RandomProducts');
app.use("/randomproducts", randomProductsRoute); 
const userRoute = require('./routes/User');
app.use("/user", userRoute); 
const validateEmailRoute = require('./routes/ValidateEmail');
app.use("/validate", validateEmailRoute); 


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
