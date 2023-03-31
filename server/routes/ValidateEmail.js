const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;

// Validate the email address
router.get("/", async (req, res) => {
  // this is how you query the url
  console.log("I was called");

  // Check if token is present
  const query = `SELECT VerificationToken FROM User WHERE Email='${req.query.email}';`

  connection.query(query, async (err, result) => {
    result.map((value) => {
      if(value.VerificationToken == req.query.token){
        console.log(req.query.token);
        console.log(req.query.email);
        console.log(value.VerificationToken);

        const insertQuery = `UPDATE User 
        SET isActive = 1
        WHERE Email='${req.query.email}'`;

        connection.query(insertQuery);

        res.redirect('/');
      }
    });
  });

  
  // Check if it hasn't expired
});

module.exports = router;
