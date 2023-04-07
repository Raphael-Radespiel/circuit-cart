const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;

const {getDateToInt} = require("../utils/DateFunctions");

// Validate the email address
router.get("/", async (req, res) => {
  console.log("VALIDATION OF EMAIL BEGINS");
  console.log(req.query.token);
  console.log(req.query.email);

  // Check if token is present
  const query = `SELECT VerificationToken, VerificationTimeLimit FROM User WHERE Email= ?;`

  connection.query(query, [req.query.email], async (err, result) => {

    // If token is present and is valid, set isActive to true 
    // and 'delete' verification token
    result.map((value) => {
      console.log(result.VerificationToken);
      console.log(req.query.token);
      
      if(value.VerificationToken != req.query.token){
        // INVALID TOKEN
        console.log("invalid");
        return;
      }

      // CHECK IF TIME EXPIRED
      const currentTime = new Date();
      if(value.VerificationTimeLimit < getDateToInt(currentTime)){
        // EXPIRED TOKEN
        console.log("Expired Time Limit");
        return;
      }
      

      const insertQuery = `UPDATE User 
      SET isActive = 1
      WHERE Email = ?;`;
      
      connection.query(insertQuery, [req.query.email]);
      
      const deleteQuery = `UPDATE User SET VerificationToken=null WHERE VerificationToken = ?;`
      
      connection.query(deleteQuery, [req.query.token]);
      
      res.redirect('/');
    });

  });
});

module.exports = router;
