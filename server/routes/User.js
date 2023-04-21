const { validateLoginForm, validateSignupForm, validateEmail } = require("../utils/ServerSideValidation");
const { setCookies, removeCookies } = require("../utils/SetCookies");
const { getDateToInt } = require("../utils/DateFunctions");
const { queryDatabase } = require("../utils/DatabaseUtil");

const dotenv = require("dotenv").config().parsed;
const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser');
const crypto = require("crypto");

const connection = require("../database").databaseConnection;

const router = express.Router();
router.use(cookieParser());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dotenv.EMAIL_USER, 
    pass: dotenv.EMAIL_PASSWORD,
  },
});

////////////
// SIGNUP //
////////////
router.post("/signup", async (req, res) => {
  let duplicateEmailQuery = `SELECT * FROM User WHERE Email= ?;`;

  queryDatabase(duplicateEmailQuery, [req.body.email])
    .then(async result => {
      if(result.length != 0){
        res.status(500)
          .send({success: false, message: "Account email already exists"});
      }
      else{
        try{
          await signup(req.body);
          res.status(201)
            .send({success: true, message: "Successful Signup"});
          }
        catch(error){
          res.status(500)
            .send({ success: false, message: error.message, error: error });
        }
      }
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).send({ success: false, message: 'database error'});
    })
});

async function signup(req){
  try{
    const { fullName, email, password} = req;
    console.log(req);

    // Check if input data is valid
    if(!validateSignupForm(req)){
      throw new Error("Invalid input data");
    }

    // Salt and Hash the password
    const hashedPassword = await hashPassword(password);
    // Create email validation token and 6 minute time limit
    const { token, verificationTimeLimit } = createVerificationToken();

    // insert our values into the database
    insertUserIntoDatabase(email, fullName, hashedPassword, token, verificationTimeLimit);

    // Send out an email with the token
    sendVerificationEmail(email, token);
  }
  catch(error){
    console.log(error);
    throw new Error(`Error in signup function: ${error.message}`);
  }
}

async function hashPassword(password){
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

function createVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const limitDate = new Date(Date.now() + 6 * 60000); // 6 minute time limit
  const verificationTimeLimit = getDateToInt(limitDate);
  return { token, verificationTimeLimit };
}

function insertUserIntoDatabase(email, fullName, hashedPassword, token, verificationTimeLimit){
  let insertQuery = `INSERT INTO User 
  (Email, FullName, Password, isActive, VerificationToken, VerificationTimeLimit, UserType, SessionID) 
  VALUES 
  (?, ?, ?, 0, ?, ?, 'customer', null);`;

  queryDatabase(insertQuery, [email, fullName, hashedPassword, token, verificationTimeLimit])
    .catch(err => console.log(err));
}

function sendVerificationEmail(email, token){
  const mailOptions = {
    from: dotenv.EMAIL_USER, 
    to: email, 
    subject: 'Confirmation Token',
    html: `<h1>Your account is almost ready!</h1><p>Click this link to confirm your email:<a href="http://localhost:5000/#/validate?token=${token}&email=${email}">confirm</a></p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
   if(err){
    console.log(err);
    throw err;
   }
   else
     console.log(info);
  });
}

///////////
// LOGIN //
///////////
router.post("/login", (req, res) => {
  const { password, email } = req.body;

  try{
    const userQuery = `SELECT Password, isActive FROM User WHERE Email = ?;`;
    connection.query(userQuery, [email], async (err, result) => {
      if(err){
        throw err;
      }

      // If the account does not exist 
      if(result.length == 0){
        res.status(500).send({ success: false, message: 'Email is not registered'});
        return;
      }

      // If the account is not validated
      if(result[0].isActive == 0){
        res.status(500).send({ success: false, message: 'Account is not validated'}); return;
      }

      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, result[0].Password);
      console.log(isValidPassword);

      if(!isValidPassword){
        res.status(500).send({ success: false, message: 'Invalid password'});
        return;
      }

      // Set cookie
      setCookies(res, email);

      res.status(201).send();
    });
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({success: false, message: error.message, error: error});
  }
});

router.post("/resend-token", (req, res) => {
  const email = req.body.email;

  // VALIDATE EMAIL INPUT
  if(!validateEmail(email)){
    res.status(500).send({ success: false, message: "Invalid Input Data"});
  }

  // Create email validation token and 6 minute time limit
  const { token, verificationTimeLimit } = createVerificationToken();

  // Check if account exists and is validated and
  // update values into the database
  const updateQuery = `UPDATE User 
  SET VerificationToken = ?, VerificationTimeLimit = ? 
  WHERE Email = ? AND isActive = 0;`;

  queryDatabase(updateQuery, [token, verificationTimeLimit, email])
    .then(result => {
      if(result.length == 0){
        res.status(500).send({ success: false, message: 'Email does not exist or is already validated'});
      }
      else{
        // Send out an email with the token
        sendVerificationEmail(email, token);
        res.status(201).send({message: "Token resent"});
      }
    })
    .catch(error => res.status(500).send(error.message));
});

router.get("/logout", (req,res) => {
  removeCookies(req.cookies.email, req.cookies.sessionID, res);
});

module.exports = router;
