const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const {getDateToInt} = require("../utils/DateFunctions");
const {setCookies} = require("../utils/SetCookies");

async function confirmValidUserInDatabase(token){
  try{
    const updateQuery = `UPDATE User 
    SET isActive = 1, VerificationToken = null, VerificationTimeLimit = null
    WHERE VerificationToken = ?;`;
    connection.query(updateQuery, [token], (err) => {throw err});
  } 
  catch(error){
    throw error;
  }
}

// Validate the email address
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

    if(result.length == 0){
        let error = new Error("Incorrect Email");
        error.header = "The email in the url token is invalid";
        error.paragraph = "The email value of the link you entered in the url is not valid. Please check that you did not modify it from the email and try again.";
        error.canResend = false;
        throw error; 
    }

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
    
    // Set cookie
    setCookies(res, email);
      
    // Update user by setting them to Active and deleting their token
    confirmValidUserInDatabase(token);

    res.status(201).json({header: "Login Successful", paragraph: "You can now shop in our website. Welcome!"});
  }
  catch (error){
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message, error: error});
  }
});

router.get("/session", async (req, res) => {
  const email = req.cookies.email;
  const session = req.cookies.sessionID;
  // if user exists and is active and is signed in
  const query = "SELECT UserType FROM User WHERE Email = ? AND isActive = 1 AND SessionID = ?;";
  try{
    connection.query(query, [email, session], (err, result) => {
      console.log(result[0]);
      if(err){
        res.status(500).send(err.message);
        return;
      } 

      if(result.length == 0){
        console.log("Length 0");
        res.status(201).send({isLoggedIn: false, isAdmin: false});
        return; 
      }

      if(result[0].UserType == "customer"){
        console.log("Customer");
        res.status(201).send({isLoggedIn: true, isAdmin: false});
        return; 
      }

        console.log("ADMIN");
        res.status(201).send({isLoggedIn: true, isAdmin: true});
        return; 
    });
  }
  catch (err){
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
