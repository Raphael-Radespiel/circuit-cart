const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const crypto = require("crypto");

const connection = require("../database").databaseConnection;

function getDateToTimeStamp(date){
  return `'${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}'`;
}

async function signup(req){
  console.log('Beginning SignUp function');
  // Validate information we where sent.
  //
  // Make sure we are not making a duplicate account
  //
  // make it safe information (no sql injections)

  // Salt and Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.password, salt);

  // Create email validation token and 6 minute time limit
  let oldDateObj = new Date();
  const diff = 6;
  let limitDate = new Date(oldDateObj.getTime() + diff*60000);

  const queryDate = getDateToTimeStamp(limitDate);

  var token = crypto.randomBytes(64).toString('hex');

  // IS VALIDATED SHOULD BE isActive 
  // insert our values into the database
  let insertQuery = `INSERT INTO User 
  (Email, FullName, Password, isValidated) 
  VALUES 
  ('${req.email}', '${req.fullName}', '${hashedPassword}', 0);`;

  await connection.query(insertQuery);

  // Send out an email with the token
  // the link would be http://localhost:5000/validate?token=token-value

  return 201;
}

// Check if its login of signup 
router.post("/", async (req, res) => {
  console.log(req.body);
  try{
    if(req.body.operationType == "signup"){
      try{
        const responseStatus = await signup(req.body);

        res.status(responseStatus).send();
      }
      catch{
        res.status(500).send();
      }

    }
    else if (req.body.operationType == "login"){

    }

    res.status(201).send();
  }
  catch{
    res.status(500).send();
  }
});


module.exports = router;
