const dotenv = require("dotenv").config().parsed;

const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();
const crypto = require("crypto");

const connection = require("../database").databaseConnection;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: dotenv.EMAIL_USER, 
      pass: dotenv.EMAIL_PASSWORD,
    },
  });

const {getDateToInt} = require("../utils/DateFunctions");


// TODO:
//  1 - CHECK IF EMAIL ALREADY IN DATABASE BEFORE CREATING 
//  2 - CHANGE CODE TO HANDLE ONLY ONE RESULT ON USER QUERIES
//  3 - CHECK IF USER IS ACTIVE WHEN LOGIN IN
//
// ADD ALL SAFETY FEATURES
// LIMIT THE CREATION OF SEVERAL ACCOUNTS
// DONT CHECK YOUR DATABASE QUERIES EXPECTING TO GET SEVERAL ACCOUNTS WITH THE SAME EMAIL
// CHECK HOW YOURE GONNA SAVE SESSION AUTHENTICATION
// JWT OR SESSION COOKIES


// Still need to add safety features
// Both on the front end and on the back end
async function signup(req){
  console.log('Beginning SignUp function');
  // Validate information we where sent.
  //
  // Make sure we are not making a duplicate account
  //
  // make it safe information (no sql injections)
  
  console.log("async result");
  console.log(result);

  console.log("Salting and hashing password");
  // Salt and Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.password, salt);

  console.log("Creating email validation token and time limit");
  // Create email validation token and 6 minute time limit
  let oldDateObj = new Date();
  const diff = 6;
  let limitDate = new Date(oldDateObj.getTime() + diff*60000);

  const queryDate = getDateToInt(limitDate);

  var token = crypto.randomBytes(32).toString('hex');

  // insert our values into the database
  let insertQuery = `INSERT INTO User 
  (Email, FullName, Password, isActive, VerificationToken, VerificationTimeLimit, UserType) 
  VALUES 
  ('${req.email}', '${req.fullName}', '${hashedPassword}', 0, '${token}', ${queryDate}, 'customer');`;

  await connection.query(insertQuery);

  console.log("Sending Email");
  // Send out an email with the token
  const mailOptions = {
    from: dotenv.EMAIL_USER, // sender address
    to: req.email, // receiver (use array of string for a list)
    subject: 'Confirmation Token',// Subject line
    html: `<h1>Your account is almost ready!</h1><p>Click this link to confirm your email:<a href="http://localhost:5000/validate?token=${token}&email=${req.email}">confirm</a></p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
   if(err)
     console.log(err)
   else
     console.log(info);
});

  console.log("All went right");
  return 201;
}

async function login(req){

  // REQ must have PASSWORD AND EMAIL

  try{
    // Get password from user with same email AND isActive is true
    const query = `SELECT Password FROM User WHERE Email='${req.email}' AND isActive=1;`;

    // await bcrypt.compare(password, database password);
    // allowed send jwt
    // not allowed send message
    //
    //  DONT MAKE THIS ARRAY LOOPING 
    //  FIX THE VALIDATE EMAIL AS WELL
    //
    connection.query(query, async (err, result) => {
      console.log(result);
      result.map(async (value) => {
        const isValidPassword = await bcrypt.compare(req.password, value.Password);
        if(isValidPassword){
          console.log("Correct Password");

        }
        else{
          // Don't log in
          console.log("Wrong Password");
        }
      })
    });
  
  }
  catch{
    return 500; 
  }
 
  return 201;
}

// Check if its login of signup 
// REMOVE CONCEPT OF OPERATION TYPE AND JUST SPLIT IT INTO TWO ROUTES 
router.post("/signup", async (req, res) => {
  console.log("CALLED ROUTE USER/SIGNUP");
  console.log(req.body);

  try{
    console.log("Checking if email exists already");
    let validityQuery = `SELECT * FROM User WHERE Email='${req.email}'`;
    await connection.query(validityQuery, async (err, result) => {
      if(result != undefined){
        res.status(500).send();
      }
      else{
        const responseStatus = await signup(req.body);

        res.status(responseStatus).send();

      }
    });
  }
  catch{
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  console.log("CALLED ROUTE USER/LOGIN");
  console.log(req.body);

  try{
    const responseStatus = await login(req.body);

    res.status(responseStatus).send();
  }
  catch{ 
    res.status(500).send();
  }
});

module.exports = router;
