const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;

router.get("/", (req, res) => {
  console.log(req.query.filter);
  console.log(req.query.search);

  if(req.query.filter == "" || req.query.filter == "all"){
    connection.query("SELECT * FROM Products;", (err, result) => {
      if(err){
        res.status(201).send(err);
      }
      
      console.log(result);
      res.status(201).send(result);
      
    });
  }
  else{
    connection.query("SELECT * FROM Products WHERE ProductType = ?;", [req.query.filter], (err, result) => {
      if(err){
        res.status(201).send(err);
      }
      
      console.log(result);
      res.status(201).send(result);
      
    });
  }
});

module.exports = router;
