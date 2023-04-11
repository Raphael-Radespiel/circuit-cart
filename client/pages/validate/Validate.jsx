import { useState, useEffect, useRef } from "react";

function getQueryParam(param) {
  const rx = new RegExp("[?&]" + param + "=([^&]+).*$");
  const returnVal = String(window.location).match(rx);
  return returnVal === null ? "" : returnVal[1];
}

function Validate({changeUserStatus}){
  const [validationState, setValidationState] = useState({canResend: false, h2Text: "Please check your email!", pText: "We have sent you a verification token so that we know your email is legitimate."});
  const emailInput = useRef(null);

  const email = getQueryParam('email');
  const token = getQueryParam('token');

  // TODO: 
  // PUT A TIME LIMIT SERVER SIDE ON THE RESEND TOKEN FUNCTION
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
        changeUserStatus((current) => current+1);
      }
      else{
        const {paragraph, header, canResend} = jsonResponse.error;
        setValidationState({pText: paragraph, h2Text: header, canResend: canResend});
      }
    })();
  }, []);

  async function resendToken(){
    const emailValue = emailInput.current.value;
    
    // VALIDATE THE EMAIL

    let data = {
      email: emailValue
    }
     
    let request = {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    let response = await fetch("/user/resend-token", request);
    
    console.log("Hello");
  }

  
  return (
    <div className="validation-container">
      <h2>{validationState.h2Text}</h2>
      <p>{validationState.pText}</p>
      {validationState.canResend && 
          (<>
            <input ref={emailInput} type="text" placeholder="email">
            </input>
            <button onClick={resendToken}className="secondary-button">Resend the token</button>
          </>)
      }
    </div>
  )
}

export default Validate;
