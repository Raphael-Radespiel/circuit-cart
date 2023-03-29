const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());

const path = require("path");

const dotenv = require("dotenv").config().parsed;

const mysql = require("mysql");
const db = mysql.createConnection({
  host: dotenv.DB_HOST,
  user: dotenv.DB_USER,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME
});

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log("MySQL connected");
});

app.use("/", express.static(path.join(__dirname, "../client")));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
})

app.post("/user-signup", async (req, res) => {
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let insertQuery = `INSERT INTO User (Email, FullName, Password, isValidated) VALUES ('${req.body.email}', '${req.body.fullName}', '${hashedPassword}', 0);`;

    await db.query(insertQuery);
    console.log("everything is good");
    res.status(201).send();
  }
  catch{
    res.status(500).send();
  }
});

const { PORT = 5000 } = process.env;

function selectRandomProducts(idArray, amount){
  const idArrayLength = idArray.length;
  let selectedIDs = [];

  while(selectedIDs.length != amount){
    // gets random number between 0 and array length
    let randomIndex = Math.floor(Math.random() * idArrayLength); 
    console.log(randomIndex);
    console.log(selectedIDs.find(element => element == idArray[randomIndex].ProductID));

    if(!selectedIDs.find(element => element == idArray[randomIndex].ProductID)){
      selectedIDs.push(idArray[randomIndex].ProductID);
    }
    console.log(selectedIDs);
  }
 
  return selectedIDs;
}

// LEARN CORRECT ERROR HANDLING
app.post("/randomproducts", (req, res) => {
  db.query("SELECT ProductID FROM Products", async (err, result) => {
    console.log(req.body.productAmount);
    let productsAmount = req.body.productAmount;
    //req.body.productsAmount;
    let products = await selectRandomProducts(result, productsAmount);

    let query = "SELECT Title, Price, ImageFile FROM Products WHERE";

    for(i = 0; i < productsAmount; i++) {
      query += ` ProductID=${products[i]}`;

      if(i != productsAmount - 1) {
        query += " OR";
      }
    }

    db.query(query, (err, result) => {
      res.send(result);
    });
  });
});

app.listen(PORT, () => {
  console.log(`  App running in port ${PORT}\n`);
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`); 
});

process.on('exit', () => {
  console.log('About to close');
  // THROW ERRORS IN FUNCTION
  db.end(); 
});
