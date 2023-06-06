const express = require("express");
const router = express.Router();
const connection = require("../database").databaseConnection;
const cookieParser = require('cookie-parser');
const { queryDatabase } = require("../utils/DatabaseUtil");

router.use(cookieParser());

const {getDateToInt} = require("../utils/DateFunctions");
const {setCookies} = require("../utils/SetCookies");

async function updateUserValidity(token){
  const updateQuery = `UPDATE User 
  SET isActive = 1, VerificationToken = null, VerificationTimeLimit = null
  WHERE VerificationToken = ?;`;

  await queryDatabase(updateQuery, [token])
    .catch(err => {throw err});
}

// Validate the email address
router.post("/", async (req, res) => {
  console.log("./validate called with POST method");
  try{
    const { token, email } = req.body;

    if(token == undefined || email == undefined)
      throw new Error("Undefined token or email");

    const tokenQuery = `SELECT VerificationToken, VerificationTimeLimit FROM User WHERE Email = ?;`

    await queryDatabase(tokenQuery, [email])
      .then(result => {
        if(result.length == 0){
          throw new Error({
            message: "Incorrect Email",
            header: "The email in the url token is invalid",
            paragraph: "The email in the url is not valid. Please check that you did not modify it from the email and try again.",
            canResend: false
          });
        }

        const { VerificationTimeLimit, VerificationToken } = result[0];

        if(VerificationToken != token){
          throw new Error({
            message: "Incorrect Token",
            header: "Your token is invalid",
            paragraph: "The token in the url is not correct. Please check that you did not modify it from the email and try again.",
            canResend: false
          });
        }

        if(VerificationTimeLimit < getDateToInt(new Date())){
          throw new Error({
            message: "Verification Token has expired",
            header: "Your Token has expired",
            paragraph: "The validation token you provided has expired. Please request a new validation token to be sent to your email.",
            canResend: true
          });
        }
      })
      .catch(err => {throw err});

      // Set cookie
      await setCookies(res, email);
        
      // Update user by setting them to Active and deleting their token
      await updateUserValidity(token);

      res.status(201).send();
  }
  catch (error){
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message, error: error});
  }
});

router.get("/session", (req, res) => {
  console.log("./validate/session called with GET method");

  const email = req.cookies.email;
  const session = req.cookies.sessionID;

  if(email == undefined || session == undefined)
    throw new Error("Undefined cookies");

  // if user exists and is active and is signed in
  const query = "SELECT Email FROM User WHERE Email = ? AND isActive = 1 AND SessionID = ?;";

  connection.query(query, [email, session], (err, result) => {
    try{
      if(err) throw err;

      if(result.length == 0){
        res.status(201).send({isLoggedIn: false});
      }
      else{
        res.status(201).send({isLoggedIn: true});
      }
    }
    catch(err){
      console.log(err);
      res.status(500).send(err.message);
    }
  });
});

module.exports = router;
