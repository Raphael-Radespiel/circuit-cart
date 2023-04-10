const dotenv = require("dotenv").config().parsed;
const validation = require("../utils/ServerSideValidation");

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
router.post("/login", async (req, res) => {
  console.log("CALLED ROUTE USER/LOGIN");
  console.log(req.body);

  try{
    const responseStatus = await login(req.body);

    res.status(responseStatus).send();
  }
  catch(error){
    console.log(error);
    res.status(500).send();
  }
});

async function login(req){

  // REQ must have PASSWORD AND EMAIL

  try{
    // Get password from user with same email AND isActive is true
    const query = `SELECT Password FROM User WHERE Email = ? AND isActive = 1;`;

    // await bcrypt.compare(password, database password);
    // allowed send jwt
    // not allowed send message
    //
    //  DONT MAKE THIS ARRAY LOOPING 
    //  FIX THE VALIDATE EMAIL AS WELL
    //
    connection.query(query, [req.email], async (err, result) => {
      // TODO: NO NEED FOR MAP MY FRIEND, USE result[0]. ITS JUST AN ARRAY
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

module.exports = router;
