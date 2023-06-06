import "../../assets/css/Forms.css"
import { validateSignupForm } from "../../utils/Validation" 

function SignUp(){

  async function handleSignUp(e){
    e.preventDefault();

    // GET AND VALIDATE DATA
    const email = e.target.querySelector("#SIGNUP_email").value;
    const password = e.target.querySelector("#SIGNUP_password").value;
    const confirmedPassword = e.target.querySelector("#SIGNUP_password-confirmation").value;
    
    let data = {email, password, confirmedPassword}

    try{
      validateSignupForm(data);
    }
    catch(error){
      alert(`${error}`)
      return;
    }

    let request = {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    let response = await fetch("/user/signup", request);

    if(response.ok == true){
      window.location = "/#/validate";
    }
    else{
      alert("Something went wrong. Try again!");
    }
  }

  return (
    <div className="form-component">
      <h2>Signup</h2>
        <form onSubmit={(e) => {handleSignUp(e)}}>
          <label htmlFor="SIGNUP_email">Email:</label>
          <input id="SIGNUP_email" type="text"/>
          <label htmlFor="SIGNUP_password">Password:</label>
          <input id="SIGNUP_password" type="password"/>
          <p>8 character minimum</p>
          <label htmlFor="SIGNUP_password-confirmation">Confirm password:</label>
          <input id="SIGNUP_password-confirmation" type="password"/>
          <input className="primary-button" type="submit" value="continue"/>
        </form>
    </div>
  )
}

export default SignUp;
