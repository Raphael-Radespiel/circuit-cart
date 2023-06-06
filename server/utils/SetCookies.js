const crypto = require("crypto");
const { queryDatabase } = require("./DatabaseUtil");

async function setCookies(res, userEmail){
  const sessionID = crypto.randomBytes(32).toString('hex');
  res.cookie('sessionID', sessionID, { maxAge: 86400000, httpOnly: true });
  res.cookie('email', userEmail, { maxAge: 86400000, httpOnly: false });

  const insertQuery = 'UPDATE User SET SessionID = ? WHERE Email = ?;';

  await queryDatabase(insertQuery, [sessionID, userEmail])
    .catch(err => {throw err});
}

async function removeCookies(email, sessionID, res){
  const insertQuery = 'UPDATE User SET SessionID = NULL WHERE Email = ? AND SessionID = ?;';

  await queryDatabase(insertQuery, [email, sessionID])
    .then(result => {

      if(result.length != undefined){
        res.cookie('sessionID', '', { maxAge: 0, httpOnly: true });
        res.cookie('email', '', { maxAge: 0, httpOnly: false });
      }
      else{
        throw new Error("User email or session ID not found");
      }
    })
    .catch(err => {throw err});
}

module.exports = {setCookies, removeCookies};
