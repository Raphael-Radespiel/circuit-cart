const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;
const cookieParser = require('cookie-parser');
const crypto = require("crypto");

router.use(cookieParser());

const {getDateToInt} = require("../utils/DateFunctions");

async function confirmValidUserInDatabase(token){
  try{
    const updateQuery = `UPDATE User 
    SET isActive = 1, VerificationToken = null
    WHERE VerificationToken = ?;`;
    connection.query(updateQuery, [token], (err) => {throw err});
  } 
  catch(error){
    throw error;
  }
}

// Validate the email address
// TODO: 
// TODO: TODO: I NEED TO TEST THIS MORE. I DONT THINK THE IS VALID WAS CHANGED
// TODO: YEAH IT WASNT CHANGED
// IF EVERYTHING GOES WELL, WE SEND THE USER TO THE MAIN PAGE, SET COOKIES
// IF THE TOKEN WAS EXPIRED, WE SEND THEM TO THE VALIDATION PAGE
// WITH A BUTTON TO CREATE A NEW TOKEN, AND AN EXPLANATION OF WHAT HAPPENED
// IF THE TOKEN IS INVALID SEND THEM TO VALIDATION PAGE AND SAY "TOKEN OR EMAIL INVALID"
router.post("/", async (req, res) => {
  console.log("VALIDATION");
  try{
    const { token, email } = req.body;

    const tokenQuery = `SELECT VerificationToken, VerificationTimeLimit FROM User WHERE Email = ?;`

    const result = await new Promise((resolve, reject) => {
      connection.query(tokenQuery, [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

      const { VerificationTimeLimit, VerificationToken } = result[0];
    console.log(token, email);
    console.log(VerificationToken);

      if(VerificationToken != token){
        let error = new Error("Incorrect Token");
        error.header = "Your token is invalid";
        error.paragraph = "The validation token link you entered in the url is not valid. Please check that you did not modify it from the email and try again.";
        error.canResend = false;
        throw error; 
      }

      if(VerificationTimeLimit < getDateToInt(new Date())){
        let error = new Error("Verification Token has expired");
        error.header = "Your Token has expired";
        error.paragraph = "The validation token you provided has expired. Please request a new validation token to be sent to your email.";
        error.canResend = true;
        throw error; 
      }
      
      // Update user by setting them to Active and deleting their token
      confirmValidUserInDatabase(token);

      // Set cookie
      const sessionID = crypto.randomBytes(32).toString('hex');
      res.cookie('sessionID', sessionID, { maxAge: 86400000, httpOnly: true });
      
    res.status(201).json({header: "Login Successful", paragraph: "You can now shop in our website. Welcome!"});
  }
  catch (error){
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message, error: error});
  }
});

module.exports = router;
