const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;

function getRandomItemsFromArray(arr, amount){
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, amount);
}

router.post("/", (req, res) => {
  const productAmount = req.body.productAmount;
  try{
    connection.query("SELECT ProductID FROM Products;", (err, result) => {
      if(err){
        throw err;
      }

      let rowPacketArray = getRandomItemsFromArray(result, productAmount);

      let formatedArray = JSON.parse(JSON.stringify(rowPacketArray)).map((value, index) => value.ProductID);

      const query = `SELECT Title, Price, ImageFile FROM Products WHERE ProductID IN (${formatedArray.join(', ')});`;

      try{
        connection.query(query, (err, result) => {
          if(err){
            throw err;
          }

          res.status(201).send(result);
        });
      }
      catch(error){
        throw error;
      }

    });
  }
  catch(error){
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
