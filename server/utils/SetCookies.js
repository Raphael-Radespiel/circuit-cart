const crypto = require("crypto");
const connection = require("../database").databaseConnection;

async function setCookies(res, userEmail){
  const sessionID = crypto.randomBytes(32).toString('hex');
  res.cookie('sessionID', sessionID, { maxAge: 86400000, httpOnly: true });
  res.cookie('email', userEmail, { maxAge: 86400000, httpOnly: false });

  const insertQuery = 'UPDATE User SET SessionID = ? WHERE Email = ?;';

  await new Promise((resolve, reject) => {
    connection.query(insertQuery, [sessionID, userEmail], (err, result) => {
      if(err){
        reject(err);
      }
      else{
        resolve(result);
      }
    });
  }).catch(err => {throw err});

  console.log("Cookie Set");
}

async function removeCookies(email, sessionID, res){
  const insertQuery = 'UPDATE User SET SessionID = NULL WHERE Email = ? AND SessionID = ?;';

  await new Promise((resolve, reject) => {
    connection.query(insertQuery, [email, sessionID], (err, result) => {
      if(err){
        reject(err);
      }
      else{
        resolve(result);
      }
    });
  })
    .then(result => {
      if(result.length != 0){
        console.log("FOUND RESULT for email and session ID (remove cookie function)");
        res.cookie('sessionID', '', { maxAge: 0, httpOnly: true });
        res.cookie('email', '', { maxAge: 0, httpOnly: false });
        res.status(201).send();
      }
      else{
        console.log("NO RESULT for email and session ID (remove cookie function)");
        res.status(500).send();
      }
    })
    .catch(err => {throw err});
}

module.exports = {setCookies, removeCookies};
