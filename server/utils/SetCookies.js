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

module.exports = setCookies;
