const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;

function selectRandomProducts(idArray, amount){
  const idArrayLength = idArray.length;
  let selectedIDs = [];

  while(selectedIDs.length != amount){
    // gets random number between 0 and array length
    let randomIndex = Math.floor(Math.random() * idArrayLength); 

    if(!selectedIDs.find(element => element == idArray[randomIndex].ProductID)){
      selectedIDs.push(idArray[randomIndex].ProductID);
    }
  }
 
  return selectedIDs;
}

// LEARN CORRECT ERROR HANDLING
router.post("/", (req, res) => {
  connection.query("SELECT ProductID FROM Products", async (err, result) => {
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

module.exports = router;
