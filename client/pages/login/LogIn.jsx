import {Link} from "react-router-dom"
import "../../assets/Forms.css"
import { validateLoginForm } from "../../utils/ClientSideValidation" 

function LogIn(){

  async function handleLogIn(e){
    e.preventDefault();

    let target = e.target;

    let data = {
      operationType: "login",
      email: target.querySelector("#LOGIN_email").value,
      password: target.querySelector("#LOGIN_password").value
    }

    // Validate data 
    if(!validateLoginForm(data)){
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
      window.location = './';
    }
  }

  return (
    <div className="form-component">
      <h2>Login</h2>
        <form onSubmit={(e) => {handleLogIn(e)}}>
          <label htmlFor="LOGIN_email">Email:</label>
          <input id="LOGIN_email" name="email" type="text"></input>
          <label htmlFor="LOGIN_password">Password:</label>
          <input id="LOGIN_password" name="password" type="password"></input>
          <div className="remember-div">
            <input id="LOGIN_remember" name="remember" type="checkbox"></input>
            <label htmlFor="LOGIN_remember">Remember me!</label>
          </div>
          <input className="primary-button" type="submit" value="submit"></input>
        </form>
      <div className="form-component__signup-cta">
        <p>Don't have an account yet?</p>
        <Link to="/signup"> 
          <button className="secondary-button">Join Now!</button>
        </Link>
      </div>
    </div>
  )
}

export default LogIn;
