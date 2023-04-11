const crypto = require("crypto");
const connection = require("../database").databaseConnection;

function setCookies(res, userEmail){
  const sessionID = crypto.randomBytes(32).toString('hex');
  res.cookie('sessionID', sessionID, { maxAge: 86400000, httpOnly: true });
  res.cookie('email', userEmail, { maxAge: 86400000, httpOnly: false });

  const insertQuery = 'UPDATE User SET SessionID = ? WHERE Email = ?;';
  connection.query(insertQuery, [sessionID, userEmail], (err) => {
    if(err){
      throw err;
    }
  });
}

function removeCookies(email, sessionID, res){
  const insertQuery = 'UPDATE User SET SessionID = NULL WHERE Email = ? AND SessionID = ?;';

  connection.query(insertQuery, [email, sessionID], (err, result) => {
    if(err){
      res.status(500).send();
      return;
    }
    if(result.length != 0){
      console.log("FOUND RESULT");
      res.cookie('sessionID', '', { maxAge: 0, httpOnly: true });
      res.cookie('email', '', { maxAge: 0, httpOnly: false });
      res.status(201).send();
      return;
    }
    else{
      console.log("NO RESULT");
      res.status(500).send();
      return;
    }
  });
  
}

module.exports = {setCookies, removeCookies};
