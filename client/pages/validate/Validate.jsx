import {Link} from "react-router-dom"

function Validate(){

  const emailAddress = 'user@emailhost.com';

  return (
    <div className="validation-form">
      <h2>Validate your email address:</h2>
      <p>We have sent you a code at {emailAddress}</p>
      <form method="post">
        <label htmlFor="validation-code">Insert the code:</label>
        <input id="validation-code" name="code" type="text"></input>
        <Link to="/"><input className="primary-button" type="submit" value="create your account"></input></Link>
      </form>
      <button className="secondary-button">resend the code</button>
    </div>
  )
}

export default Validate;
