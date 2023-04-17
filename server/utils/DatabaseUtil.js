const connection = require("../database").databaseConnection;

function queryDatabase(queryString, params){
  return new Promise((resolve, reject) => {
    if(params){
      connection.query(queryString, params, (err, result) => {
        if(err){
          reject(err);
        }
        else{
          resolve(result);
        }
      });
    }
    else{
      connection.query(queryString, (err, result) => {
        if(err){
          reject(err);
        }
        else{
          resolve(result);
        }
      });
    }
  });
}

module.exports = { queryDatabase };
