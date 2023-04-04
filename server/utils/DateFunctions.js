
function getDateToInt(date){
  const year = date.getFullYear();
  const month = date.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const day = date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const hour = date.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const minute = date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const second = date.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});


  return Number(`${year}${month}${day}${hour}${minute}${second}`);
}

module.exports = {getDateToInt}
