const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;

const {getDateToInt} = require("../utils/DateFunctions");

async function confirmValidUserInDatabase(token){
  try{
    const updateQuery = `UPDATE User 
    SET isActive = 1, VerificationToken = null
    WHERE VerificationToken = ?;`;
    connection.query(updateQuery, [token]);
  } 
  catch(error){
    throw error;
  }
}

// Validate the email address
// TODO: 
// IF EVERYTHING GOES WELL, WE SEND THE USER TO THE MAIN PAGE, SET COOKIES
// IF THE TOKEN WAS EXPIRED, WE SEND THEM TO THE VALIDATION PAGE
// WITH A BUTTON TO CREATE A NEW TOKEN, AND AN EXPLANATION OF WHAT HAPPENED
// IF THE TOKEN IS INVALID SEND THEM TO VALIDATION PAGE AND SAY "TOKEN OR EMAIL INVALID"
router.get("/", async (req, res) => {
  try{
    const { token, email } = req.query;

    const tokenQuery = `SELECT VerificationToken, VerificationTimeLimit FROM User WHERE Email = ?;`

    connection.query(tokenQuery, [email], async (err, result) => {
      if(err){
        throw err;
      }

      const { VerificationTimeLimit, VerificationToken } = result[0];

      if(VerificationToken != token){
        throw new Error("Incorrect Token");
      }

      if(VerificationTimeLimit < getDateToInt(Date.now())){
        // SHOW THEM THE HTML PAGE WITH A POSSIBILITY TO RESEND THE TOKEN
        throw new Error("Expired Verification Token");
      }
      
      // Update isActive and delete token for user
      await confirmValidUserInDatabase(token);

      // TODO: ADD COOKIES 
      
      res.status(201).redirect('/');
    });
  }
  catch (error){
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message});
  }
});

module.exports = router;
