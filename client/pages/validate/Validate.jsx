import { useState, useEffect } from "react";
import {getQueryParam} from "../../utils/getQueryParam"

function Validate({getLoginStatus}){
  const [validationState, setValidationState] = useState({canResend: false, h2Text: "Please check your email!", pText: "We have sent you a verification token."});

  const email = getQueryParam('email');
  const token = getQueryParam('token');

  useEffect(() => {
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

    fetch("/validate", request)
      .then(async response => {
        if(response.ok){
          getLoginStatus();
          window.location = "/#/";
        }
        else{
          let jsonResponse = await response.json();
          console.log(jsonResponse);
          const {paragraph, header, canResend} = jsonResponse.error;
          setValidationState({pText: paragraph, h2Text: header, canResend: canResend});
        }
      })
  }, []);

  function resendToken(){
    fetch("/user/resend-token", {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email})
    });
  }

  
  return (
    <div className="validation-container">
      <h2>{validationState.h2Text}</h2>
      <p>{validationState.pText}</p>
      {
        validationState.canResend && 
          (
            <button onClick={resendToken} className="secondary-button">Resend the token</button>
          )
      }
    </div>
  )
}

export default Validate;
