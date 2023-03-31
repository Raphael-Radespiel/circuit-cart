const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const connection = require("../database").databaseConnection;

// Check if its login of signup 
router.post("/", async (req, res) => {
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let insertQuery = `INSERT INTO User (Email, FullName, Password, isValidated) VALUES ('${req.body.email}', '${req.body.fullName}', '${hashedPassword}', 0);`;

    await connection.query(insertQuery);
    res.status(201).send();
  }
  catch{
    res.status(500).send();
  }
});

module.exports = router;
