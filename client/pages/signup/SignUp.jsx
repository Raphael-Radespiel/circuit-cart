import { Link } from "react-router-dom"

function SignUp(){

  async function handleSignUp(e){
    e.preventDefault();

    let target = e.target;

    let data = {
      operationType: "signup",
      fullName: target.querySelector("#SIGNUP_full-name").value,
      email: target.querySelector("#SIGNUP_email").value,
      password: target.querySelector("#SIGNUP_password").value,
      confirmedPassword: target.querySelector("#SIGNUP_password-confirmation").value
    }

    // ADD A FUNCTION HERE TO SEE IF THE INFORMATION IS VALID BEFORE SENDING TO THE SERVER 
    // and validating its safety there also

    let request = {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    let rawResponse = await fetch("/user", request);

    if(String(rawResponse.status).match(/^2\d\d$/) != null){
      window.location = './#/signup/validate';
    }
  }

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div className="signup-container__form">
        <form onSubmit={(e) => {handleSignUp(e)}}>
          <label htmlFor="SIGNUP_full-name">Your full name:</label>
          <input id="SIGNUP_full-name" name="full-name" type="text"></input>
          <label htmlFor="SIGNUP_email">Email:</label>
          <input id="SIGNUP_email" name="email" type="text"></input>
          <label htmlFor="SIGNUP_password">Password:</label>
          <input id="SIGNUP_password" name="password" type="password"></input>
          <p>(PASSWORD CONDITION, for example, must have at least six letters)</p>
          <label htmlFor="SIGNUP_password-confirmation">Confirm your password:</label>
          <input id="SIGNUP_password-confirmation" name="password-confirmation" type="password"></input>
          <input type="submit" value="continue"></input>
        </form>
      </div>
    </div>
  )
}

export default SignUp;
