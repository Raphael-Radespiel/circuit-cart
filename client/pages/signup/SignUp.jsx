import "../../assets/Forms.css"

function SignUp(){

  function checkIfValidForm(data){
    // Test Name
    if(data.fullName == ""){
      console.log("Sorry, your name is not an empty string");
      return false;
    }

    // Test Email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(data.email)){
      console.log("Sorry, invalid email");
      return false;
    }

    // Test Password
    if(data.password.length < 8){
      console.log("Sorry, password needs to be 8 or longer");
      return false;
    }

    if(data.password.length > 16){
      console.log("Sorry, password is longer than 16 characters");
      return false;
    }

    if(data.password != data.confirmedPassword){
      console.log("Your password and confirmed password are not the same");
      return false;
    }

    return true;
  }

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

    // VALIDATE DATA 
    if(!checkIfValidForm(data)){
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

    let rawResponse = await fetch("/user", request);

    if(String(rawResponse.status).match(/^2\d\d$/) != null){
      window.location = './#/signup/validate';
    }
  }

  return (
    <div className="form-component">
      <h2>Signup</h2>
        <form onSubmit={(e) => {handleSignUp(e)}}>
          <label htmlFor="SIGNUP_full-name">Your full name:</label>
          <input id="SIGNUP_full-name" name="full-name" type="text"></input>
          <label htmlFor="SIGNUP_email">Email:</label>
          <input id="SIGNUP_email" name="email" type="text"></input>
          <label htmlFor="SIGNUP_password">Password:</label>
          <input id="SIGNUP_password" name="password" type="password"></input>
          <p>password must have a minimum of 8 characters</p>
          <label htmlFor="SIGNUP_password-confirmation">Confirm your password:</label>
          <input id="SIGNUP_password-confirmation" name="password-confirmation" type="password"></input>
          <input className="primary-button" type="submit" value="continue"></input>
        </form>
    </div>
  )
}

export default SignUp;
