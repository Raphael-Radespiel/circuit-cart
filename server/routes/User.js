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

// SIGNUP
router.post("/signup", (req, res) => {
  console.log("./user/signup was called with POST method");
  try{
    let duplicateEmailQuery = `SELECT * FROM User WHERE Email= ?;`;

    if(req.body.email == undefined) throw new Error("Undefined email");

    // Check if account already exists
    connection.query(duplicateEmailQuery, [req.body.email], async (err, result) => {
      if(err) throw new Error({ success: false, message: 'database error'});

      console.log("Queried database with result of: ");
      console.log(result);

      if(result.length != 0){
        res.status(200).send({success: false, message: "Account email already exists"});
      }
      else{
        await signup(req.body);
        res.status(201).send({success: true, message: "Successful Signup"});
      }
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send({ success: false, message: error.message, error: error });
  }
});

async function signup(req){
  const { email, password} = req;
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
  await insertUserIntoDatabase(email, hashedPassword, token, verificationTimeLimit);

  // Send out an email with the token
  await sendVerificationEmail(email, token);
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

// LOGIN
router.post("/login", (req, res) => {
  console.log("./user/login with POST method")
  try{
    const { password, email } = req.body;
    if(password == undefined || email == undefined) throw new Error("Undefined params");

    const userQuery = `SELECT Password, isActive FROM User WHERE Email = ?;`;
    connection.query(userQuery, [email], async (err, result) => {
      if(err)
        throw err;

      if(result.length == 0)
        throw new Error({message: 'Email is not registered'});

      if(result[0].isActive == 0)
        throw new Error({message: 'Account not validated'});

      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, result[0].Password);
      if(!isValidPassword)
        throw new Error({message: 'Invalid Password'});

      // Set cookie
      await setCookies(res, email);

      res.status(201).send();
    });
  }
  catch(error){
    console.log(error.message);
    res.status(500).send({success: false, message: error.message, error: error});
  }
});

router.post("/resend-token", (req, res) => {
  try{
    const email = req.body.email;

    if(email == undefined) throw new Error("Undefined email");

    // VALIDATE EMAIL INPUT
    if(!validateEmail(email)){
      throw new Error({ success: false, message: "Invalid Input Data"});
    }

    // Create email validation token and 6 minute time limit
    const { token, verificationTimeLimit } = createVerificationToken();

    // Check if account exists and is validated then update values into the database
    const updateQuery = `UPDATE User 
    SET VerificationToken = ?, VerificationTimeLimit = ? 
    WHERE Email = ? AND isActive = 0;`;

    connection.query(updateQuery, [token, verificationTimeLimit, email], async (err, result) => {
      if(err) throw err;

      if(result.length == 0){
        throw new Error({success: false, message: 'Email does not exist or is already validated'});
      }
      else{
        await sendVerificationEmail(email, token);
        res.status(201).send({message: "Token resent"});
      }
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/logout", (req,res) => {
  console.log("./user/logout with GET method");
  try{

    if(req.cookies.email == undefined || req.cookies.sessionID == undefined)
      throw new Error("Undefined cookies");

    removeCookies(req.cookies.email, req.cookies.sessionID, res);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
