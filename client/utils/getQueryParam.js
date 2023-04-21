
function getQueryParam(param) {
  const rx = new RegExp("[?&]" + param + "=([^&]+).*$");
  const returnVal = String(window.location).match(rx);
  return returnVal === null ? "" : returnVal[1];
} 

export {getQueryParam}
