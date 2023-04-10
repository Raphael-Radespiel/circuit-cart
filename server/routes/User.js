const dotenv = require("dotenv").config().parsed;
const validation = require("../utils/ServerSideValidation");
const setCookies = require("../utils/SetCookies");

const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser');
const crypto = require("crypto");

const connection = require("../database").databaseConnection;

// TODO: 
// COOKIE PARSER SHOULD ONLY BE USED IN LOGIN AND VALIDATE EMAIL FUNCTIONS
const router = express.Router();
router.use(cookieParser());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: dotenv.EMAIL_USER, 
      pass: dotenv.EMAIL_PASSWORD,
    },
  });

const {getDateToInt} = require("../utils/DateFunctions");

////////////
// SIGNUP //
////////////
router.post("/signup", async (req, res) => {
  try{
    let duplicateEmailQuery = `SELECT * FROM User WHERE Email= ?;`;

    connection.query(duplicateEmailQuery, [req.body.email], async (err, result) => {
      if(err){
        res.status(500).send({ success: false, message: 'database error'});
        return;
      }

      // If the account is a duplicate
      if(result.length != 0){
        res.status(500).send({ success: false, message: "Account email already exists"});
        return;
      }

      await signup(req.body);
      res.status(201).send({success: true, message: "Successful Signup"});
    });
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({success: false, message: error.message, error: error});
  }
});

async function signup(req){
  try{
    const { fullName, email, password} = req;

    // Check if input data is valid
    if(!validation.validateSignupForm(req)){
      throw new Error("Invalid input data");
    }

    // Salt and Hash the password
    const hashedPassword = await hashPassword(password);
    // Create email validation token and 6 minute time limit
    const { token, verificationTimeLimit } = await createVerificationToken();

    // insert our values into the database
    await insertUserIntoDatabase(email, fullName, hashedPassword, token, verificationTimeLimit);

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

async function createVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const limitDate = new Date(Date.now() + 6 * 60000); // 6 minute time limit
  const verificationTimeLimit = getDateToInt(limitDate);
  return { token, verificationTimeLimit };
}

async function insertUserIntoDatabase(email, fullName, hashedPassword, token, verificationTimeLimit){
  let insertQuery = `INSERT INTO User 
  (Email, FullName, Password, isActive, VerificationToken, VerificationTimeLimit, UserType) 
  VALUES 
  (?, ?, ?, 0, ?, ?, 'customer');`;

  await connection.query(insertQuery, [email, fullName, hashedPassword, token, verificationTimeLimit]);
}

function sendVerificationEmail(email, token){
  const mailOptions = {
    from: dotenv.EMAIL_USER, 
    to: email, 
    subject: 'Confirmation Token',
    html: `<h1>Your account is almost ready!</h1><p>Click this link to confirm your email:<a href="http://localhost:5000/#/validate?token=${token}&email=${email}">confirm</a></p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
   if(err)
    throw err;
   else
     console.log(info);
  });
}

///////////
// LOGIN //
///////////
router.post("/login", (req, res) => {
  console.log("CALLED ROUTE USER/LOGIN");
  console.log(req.body);
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
        res.status(500).send({ success: false, message: 'Account is not validated'});
        return;
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

router.post("/resend-token", async (req, res) => {
  try{
    const email = req.body.email;

    // VALIDATE EMAIL INPUT
    if(!validation.validateEmail(email)){
      throw new Error("Invalid input data");
    }
    // Create email validation token and 6 minute time limit
    const { token, verificationTimeLimit } = await createVerificationToken();

    // update values into the database
    const updateQuery = `UPDATE User 
    SET VerificationToken = ?, VerificationTimeLimit = ? 
    WHERE Email = ? AND isActive = 0;`;

    connection.query(updateQuery, [token, verificationTimeLimit, email], (err, result) => {
      if(err){
        throw err;
      }

      // If the account does not exist or is already validated
      if(result.length == 0){
        res.status(500).send({ success: false, message: 'Email does not exist or is already validated'});
        return;
      }

      // Send out an email with the token
      sendVerificationEmail(email, token);

      res.status(201).send({message: "Token resent"});
    });
  }
  catch(err){
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;
