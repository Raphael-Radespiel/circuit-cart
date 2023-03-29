import { Link } from "react-router-dom"

function SignUp(){

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div className="signup-container__form">
        <form method="post" id="user-signup">
          <label htmlFor="SIGNUP_full-name">Your full name:</label>
          <input id="SIGNUP_full-name" name="full-name" type="text"></input>
          <label htmlFor="SIGNUP_email">Email:</label>
          <input id="SIGNUP_email" name="email" type="text"></input>
          <label htmlFor="SIGNUP_password">Password:</label>
          <input id="SIGNUP_password" name="password" type="password"></input>
          <p>(PASSWORD CONDITION, for example, must have at least six letters)</p>
          <label htmlFor="SIGNUP_password-confirmation">Confirm your password:</label>
          <input id="SIGNUP_password-confirmation" name="password-confirmation" type="password"></input>
          <Link to="/signup/validate"><input type="submit" value="continue"></input></Link>
        </form>
      </div>
    </div>
  )
}

export default SignUp;
