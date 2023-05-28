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

router.get("/", (req, res) => {
  console.log("./products was called with GET method");

  try{
    const productAmount = req.query.amount;

    console.log("The query amount: " + req.query.amount);

    if(productAmount == undefined){
      throw new Error("Query amount undefined");
    }

    // GET ALL PRODUCT IDs
    connection.query("SELECT ProductID FROM Products;", (err, result) => {
      if(err) throw err;

      let rowPacketArray = getRandomItemsFromArray(result, productAmount);
      let formatedArray = JSON.parse(JSON.stringify(rowPacketArray)).map(value => value.ProductID);
      const queryString = `SELECT Title, Price, ImageFile, AmountInStock, ProductID
      FROM Products WHERE ProductID IN (${formatedArray.join(', ')});`;

      // QUERY THE RANDOM IDs AND SEND THE RESULT
      connection.query(queryString, (err, result) => {
        if(err) throw err;
        res.status(201).send(result);
      });
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/from-id", (req, res) => {
  console.log("./products/from-id was called with GET method");
  try{
    const productID = req.query.id;

    console.log("The query id: " + req.query.id);

    if(productID == undefined){
      throw new Error("Query id undefined");
    }

    connection.query(
      "SELECT Title, ProductID, Price, AmountInStock, ImageFile, Description FROM Products WHERE ProductID = ?;",
      [productID],
      (err, result) => {
      if(err) throw err;
      res.status(201).send(result);
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
