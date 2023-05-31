import "../../assets/css/Forms.css"
import { validateSignupForm } from "../../utils/Validation" 
import { postRequest } from "../../utils/PostRequest"

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

    // TODO: 
    // This should not be using the util function.
    // We should handle the response in this function.
    // If the email already exists, don't take the user to /#/validate
    await postRequest(data, "/user/signup", () => {
      window.location = "/#/validate";
    });
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
