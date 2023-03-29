import {Link} from "react-router-dom"

function LogIn(){
  return (
    <div className="login-container">
      <div className="login-container__form">
        <form method="post" id="user-login">
          <label for="LOGIN_username">Username:</label>
          <input id="LOGIN_username" name="username" type="text"></input>
          <label for="LOGIN_password">Password:</label>
          <input id="LOGIN_password" name="password" type="password"></input>
          <input id="LOGIN_remember" name="remember" type="checkbox"></input>
          <label for="LOGIN_remember">Remember me!</label>
          <input type="submit" value="login"></input>
        </form>
      </div>
      <div className="login-container__signin">
        <p>You don't have an account yet?</p>
        <Link to="/signup"> 
          <button>Join Now!</button>
        </Link>
      </div>
    </div>
  )
}

export default LogIn;
