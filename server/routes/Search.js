const express = require("express");
const router = express.Router();
const fuzzySearch = require("fuzzy-search");
const connection = require("../database").databaseConnection;

router.get("/", (req, res) => {
  console.log("./search has been called with GET method");

  try{
    const [filter, search] = [req.query.filter, req.query.search];
    console.log("filter query = " + filter);
    console.log("search query = " + search);

    if(filter == undefined || search == undefined)
      throw new Error("Undefined query");

    let productTypeQueryString;
    let productTypeQueryParams;

    if(req.query.filter == "" || req.query.filter == "all"){
      productTypeQueryString = "SELECT Title, ProductID FROM Products;";
      productTypeQueryParams = [];
    }
    else{
      productTypeQueryString = "SELECT Title, ProductID FROM Products WHERE ProductType = ?;";
      productTypeQueryParams = [filter]
    }

    connection.query(productTypeQueryString, productTypeQueryParams, (err, result) => {
      if(err) throw err;

      const searchOrder = getProductOrderFromSearch(result, search);
      const queryString = getQueryStringFromSearchOrder(searchOrder);

      if(searchOrder.length != 0){ 
        connection.query(queryString, (err, result) => {
          if(err) throw err;
          res.status(201).send({result, order: searchOrder});
        });
      }
      else{
        res.status(201).send({result: [], order: []});
      }
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
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
