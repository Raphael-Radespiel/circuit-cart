const express = require("express");
const router = express.Router();
const {queryDatabase} = require("../utils/DatabaseUtil");

function getRandomItemsFromArray(arr, amount){
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, amount);
}

router.post("/", (req, res) => {
  const productAmount = req.body.productAmount;

  queryDatabase("SELECT ProductID FROM Products;")
    .then(result => {
      let rowPacketArray = getRandomItemsFromArray(result, productAmount);

      let formatedArray = JSON.parse(JSON.stringify(rowPacketArray))
        .map(value => value.ProductID);

      const queryString = `SELECT Title, Price, ImageFile, AmountInStock, ProductID
      FROM Products WHERE ProductID IN (${formatedArray.join(', ')});`;

      return queryDatabase(queryString)
    })
    .then(productResult => res.status(201).send(productResult))
    .catch(error => res.status(500).send(error));
});

router.get("/from-id", (req, res) => {
  queryDatabase("SELECT Title, ProductID, Price, AmountInStock, ImageFile, Description FROM Products WHERE ProductID = ?;", [req.query.id])
    .then(result => res.status(201).send(result))
    .catch(error => res.status(500).send(error));
});

module.exports = router;
