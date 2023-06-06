const { validateSignupForm, validateEmail } = require("../utils/ServerSideValidation");
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

// GOOD ERROR HANDLING
router.post("/signup", (req, res) => {
  console.log("./user/signup was called with POST method");

  if(req.body.email == undefined || req.body.password == undefined) throw new Error("Undefined body");

  // Check if account already exists
  connection.query(`SELECT * FROM User WHERE Email= ?;`, [req.body.email], async (err, result) => {
    try{
      if(err) 
        throw err;

      if(result.length != 0){
        res.status(200).send("Account email already exists");
      }
      else{
        await signup(req.body);
        res.status(201).send("Successful Signup");
      }
    }
    catch(err){
      console.log(err.message);
      res.status(500).send({message: err.message});
    }
  });
});

async function signup(req){
  const { email, password} = req;
  console.log(req);

  // Check if input data is valid
  validateSignupForm(req)

  // Salt and Hash the password
  const hashedPassword = await hashPassword(password);
  // Create email validation token and 6 minute time limit
  const { token, verificationTimeLimit } = createVerificationToken();

  // Send out an email with the token
  await sendVerificationEmail(email, token);

  // insert our values into the database
  await insertUserIntoDatabase(email, hashedPassword, token, verificationTimeLimit);
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

async function insertUserIntoDatabase(email, hashedPassword, token, verificationTimeLimit){
  let insertQuery = `INSERT INTO User 
  (Email, Password, isActive, VerificationToken, VerificationTimeLimit, UserType, SessionID) 
  VALUES 
  (?, ?, 0, ?, ?, 'customer', null);`;

  await queryDatabase(insertQuery, [email, hashedPassword, token, verificationTimeLimit])
    .catch(err => {throw err});
}

// GOOD ERROR HANDLING
// TODO: CHANGE EMAIL HTML
async function sendVerificationEmail(email, token){
  const mailOptions = {
    from: dotenv.EMAIL_USER, 
    to: email, 
    subject: 'Confirmation Token',
    html: `<h1>Your account is almost ready!</h1><p>Click this link to confirm your email:<a href="http://localhost:5000/#/validate?token=${token}&email=${email}">confirm</a></p>`
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      }
      else{
        console.log(info);
        resolve(info);
      }
    });
  }).catch(err => {throw err});
}

// WRITE MY COMMIT LIKE
// I READ THE EXPRESS DOCUMENTATION
// IT HANDLES ERRORS NORMALLY
// BUT IF ITS INSIDE AN ASYNC FUNCTION, 
// WE HAVE TO HAVE A TRY CATCH BLOCK INSIDE OF THEM
// AND NOW IT WORKS
// NOW IM TESTING WITH CURL ALL THESE FUNCTIONS AND METHODS
//
// CURL help
// -X METHOD-NAME to change method
// --cookie "name=value" for setting cookies
// -H 'Content-Type: application/json'
// -d '{"KEY": "VALUE", "KEY": "VALUE"}'
//
// AFTER GOING THROUGH EACH METHOD HTTP REQUEST, 
// CHECK THE FUNCTIONS THAT ARE USED INSIDE THESE METHODS

// GOOD ERROR HANDLING
router.post("/login", (req, res) => {
  console.log("./user/login with POST method")
  const { password, email } = req.body;
  if(password == undefined || email == undefined) throw new Error("Undefined params");

  const userQuery = `SELECT Password, isActive FROM User WHERE Email = ?;`;
  connection.query(userQuery, [email], async (err, result) => {
    try{
      if(err)
        throw err;

      if(result.length == 0)
        throw new Error('Email is not registered');

      if(result[0].isActive == 0)
        throw new Error('Account not validated');

      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, result[0].Password);
      if(!isValidPassword)
        throw new Error('Invalid Password');

      // Set cookie
      await setCookies(res, email);

      res.status(201).send();
    }
    catch(err){
      console.log(err.message);
      res.status(500).send({message: err.message});
    }
  });
});

// GOOD ERROR HANDLING
router.post("/resend-token", (req, res) => {
  const email = req.body.email;

  if(email == undefined) throw new Error("Undefined email");

  // VALIDATE EMAIL INPUT
  validateEmail(email);

  // Create email validation token and 6 minute time limit
  const { token, verificationTimeLimit } = createVerificationToken();

  // Check if account exists and is validated then update values into the database
  const updateQuery = `UPDATE User 
  SET VerificationToken = ?, VerificationTimeLimit = ? 
  WHERE Email = ? AND isActive = 0;`;

  connection.query(updateQuery, [token, verificationTimeLimit, email], async (err, result) => {
    try{
      if(err) 
        throw err;

      if(result.length == undefined){
        throw new Error('Email does not exist or is already validated');
      }
      else{
        await sendVerificationEmail(email, token);
        res.status(201).send("Token resent");
      }
    }
    catch(err){
      console.log(err);
      res.status(500).send(err.message);
    }
  });
});

// GOOD ERROR HANDLING
router.get("/logout", async (req,res) => {
  console.log("./user/logout with GET method");
  try{
    if(req.cookies.email == undefined || req.cookies.sessionID == undefined)
      throw new Error("Undefined cookies");

    await removeCookies(req.cookies.email, req.cookies.sessionID, res);
    res.status(201).send();
  }
  catch(err){
    res.status(500).send(err.message);
  }
});

module.exports = router;
