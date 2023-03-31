const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");

const connection = require("./database").databaseConnection;

// ROUTES
const userRoute = require('./routes/User');
app.use("/user", userRoute); 

app.use("/", express.static(path.join(__dirname, "../client")));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
})

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
  connection.query("SELECT ProductID FROM Products", async (err, result) => {
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

    connection.query(query, (err, result) => {
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
  connection.end(); 
});
