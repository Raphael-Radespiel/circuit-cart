import { useState, useEffect } from "react";

function getQueryParam(param) {
  const rx = new RegExp("[?&]" + param + "=([^&]+).*$");
  const returnVal = String(window.location).match(rx);
  return returnVal === null ? "" : returnVal[1];
}

function Validate(){
  const [validationState, setValidationState] = useState({canResend: false, h2Text: "Please check your email!", pText: "We have sent you a verification token so that we know your email is legitimate."});

  const email = getQueryParam('email');
  const token = getQueryParam('token');

  // TODO: 
  // PUT A TIME LIMIT SERVER SIDE ON THE RESEND TOKEN FUNCTION
  // CHANGE OUR ACCESS TO THE BUTTON DEPENDING ON THE ERROR (SEND THAT INFO SERVER SIDE THROUGH THE ERROR)
  // SEND PARAGRAPH TEXT SERVER SIDE AS WELL
  useEffect(() => {
    (async function getCorrectText(){
      if(email.length == 0 || token.length == 0){
        return;
      }
      let data = {
        email: email,
        token: token
      }
       
      let request = {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      let response = await fetch("/validate", request);
      const jsonResponse = await response.json();

      if(response.ok){
        const {paragraph, header, canResend} = jsonResponse;
        setValidationState({pText: paragraph, h2Text: header, canResend: canResend});
      }
      else{
        const {paragraph, header, canResend} = jsonResponse.error;
        setValidationState({pText: paragraph, h2Text: header, canResend: canResend});
      }
    })();
  }, []);


  
  return (
    <div className="validation-container">
      <h2>{validationState.h2Text}</h2>
      <p>{validationState.pText}</p>
      {validationState.canResend && <button className="secondary-button">Resend the token</button>}
    </div>
  )
}

export default Validate;
