import { Link } from "react-router-dom"

import { validateLoginForm } from "../../utils/Validation" 
import { postRequest } from "../../utils/PostRequest"

import "../../assets/css/Forms.css"

function LogIn({getLoginStatus}){

  async function handleLogIn(e){
    e.preventDefault();

    // GET AND VALIDATE DATA
    const email = e.target.querySelector("#LOGIN_email").value;
    const password = e.target.querySelector("#LOGIN_password").value;

    let data = {email, password}

    try{
      validateLoginForm(data);
    }
    catch(error){
      alert(`${error}`)
      return;
    }

    await postRequest(data, "/user/login", () => {
      getLoginStatus();
      window.location = '/#/';
    });
  }

  return (
    <div className="form-component">
      <h2>Login</h2>
        <form onSubmit={(e) => handleLogIn(e)}>
          <label htmlFor="LOGIN_email">Email:</label>
          <input id="LOGIN_email" type="text"/>
          <label htmlFor="LOGIN_password">Password:</label>
          <input id="LOGIN_password" type="password"/>
          <input className="primary-button" type="submit" value="Submit"/>
        </form>
      <div className="form-component__signup-cta">
        <p>Don't have an account yet?</p>
        <Link to="/signup" className="react-router-links secondary-button"> 
          Join Now!
        </Link>
      </div>
    </div>
  )
}

export default LogIn;
