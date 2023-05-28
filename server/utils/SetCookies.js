const crypto = require("crypto");
const { queryDatabase } = require("./DatabaseUtil");

async function setCookies(res, userEmail){
  const sessionID = crypto.randomBytes(32).toString('hex');
  res.cookie('sessionID', sessionID, { maxAge: 86400000, httpOnly: true });
  res.cookie('email', userEmail, { maxAge: 86400000, httpOnly: false });

  const insertQuery = 'UPDATE User SET SessionID = ? WHERE Email = ?;';

  await queryDatabase(insertQuery, [sessionID, userEmail])
    .catch(error => {
      throw error
    });
  console.log("Cookie Set");
}

async function removeCookies(email, sessionID, res){
  const insertQuery = 'UPDATE User SET SessionID = NULL WHERE Email = ? AND SessionID = ?;';

  await queryDatabase(insertQuery, [email, sessionID])
    .then(result => {
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
    })
    .catch(error => {
      res.status(500).send(error);
    });
}

module.exports = {setCookies, removeCookies};
