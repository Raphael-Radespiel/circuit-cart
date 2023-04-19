const express = require("express");
const router = express.Router();
const fuzzySearch = require("fuzzy-search");
const connection = require("../database").databaseConnection;

router.get("/", (req, res) => {
  console.log(req.query.filter);
  console.log(req.query.search);

  if(req.query.filter == "" || req.query.filter == "all"){
    connection.query("SELECT Title, ProductID FROM Products;", (err, result) => {
      if(err){
        res.status(201).send(err);
      }

      const searchOrder = getProductOrderFromSearch(result, req.query.search);
      const queryString = getQueryStringFromSearchOrder(searchOrder);

      console.log(searchOrder);
      console.log(queryString);

      if(searchOrder.length != 0){ 
        console.log("WHY");
        connection.query(queryString, (err, result) => {
          if(err){
            res.status(201).send(err);
          }

          res.status(201).send({result, order: searchOrder});
        });
      }
      else{
        res.status(201).send({result: [], order: []});
      }
    });
  }
  else{
    connection.query("SELECT Title, ProductID FROM Products WHERE ProductType = ?;", [req.query.filter], (err, result) => {
      if(err){
        res.status(201).send(err);
      }
      
      const searchOrder = getProductOrderFromSearch(result, req.query.search);
      const queryString = getQueryStringFromSearchOrder(searchOrder);

      console.log(searchOrder);
      console.log(queryString);

      if(searchOrder.length != 0){ 
        console.log("WHY");
        connection.query(queryString, (err, result) => {
          if(err){
            res.status(201).send(err);
          }

          res.status(201).send({result, order: searchOrder});
        });
      }
      else{
        res.status(201).send({result: [], order: []});
      }
    });
  }
});

function getProductOrderFromSearch(result, searchTerm){
  let formatedArray = JSON.parse(JSON.stringify(result));
  const searcher = new fuzzySearch(formatedArray, ['Title'], {sort: true});
  const searchOrder = searcher.search(searchTerm).map(v => v.ProductID);
  return searchOrder;
}

function getQueryStringFromSearchOrder(orderArray){
  return `SELECT 
  Title, ProductID, Price, ImageFile, AmountInStock
  FROM Products 
  WHERE ProductID IN (${orderArray.join(', ')});`;
}

module.exports = router;
