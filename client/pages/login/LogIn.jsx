import {Link} from "react-router-dom"

function LogIn(){
  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-container__form">
        <form method="post" action="user-login" id="user-login">
          <label htmlFor="LOGIN_email">Email:</label>
          <input id="LOGIN_email" name="email" type="text"></input>
          <label htmlFor="LOGIN_password">Password:</label>
          <input id="LOGIN_password" name="password" type="password"></input>
          <input id="LOGIN_remember" name="remember" type="checkbox"></input>
          <label htmlFor="LOGIN_remember">Remember me!</label>
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
