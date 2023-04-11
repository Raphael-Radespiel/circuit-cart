import { Link } from "react-router-dom"
import { useState } from "react";
import "../assets/Hamburger.css";

function Hamburger(props){
  const [isDropDown, setDropDown] = useState(false);

  function updateDropDownState(){
    setDropDown(previousBoolean => !previousBoolean);
  }

  async function logOutUser(){
    await fetch(`/user/logout`, {method: 'GET', credentials: "same-origin"});
  }

  return(
    <>
      {!props.isLoggedIn ?
          (<Link className="react-router-links" to="/login"><button className="login-button">Login</button></Link>) :
      (<div className="hamburger">
        <button onClick={updateDropDownState}>
          {!isDropDown ? 
          (<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24">
            <path d="m2.344 15.271 2 3.46a1 1 0 0 0 1.366.365l1.396-.806c.58.457 1.221.832 1.895 1.112V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.598a8.094 8.094 0 0 0 1.895-1.112l1.396.806c.477.275 1.091.11 1.366-.365l2-3.46a1.004 1.004 0 0 0-.365-1.366l-1.372-.793a7.683 7.683 0 0 0-.002-2.224l1.372-.793c.476-.275.641-.89.365-1.366l-2-3.46a1 1 0 0 0-1.366-.365l-1.396.806A8.034 8.034 0 0 0 15 4.598V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.598A8.094 8.094 0 0 0 7.105 5.71L5.71 4.904a.999.999 0 0 0-1.366.365l-2 3.46a1.004 1.004 0 0 0 .365 1.366l1.372.793a7.683 7.683 0 0 0 0 2.224l-1.372.793c-.476.275-.641.89-.365 1.366zM12 8c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z"/>
          </svg>) : 
          (<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"/></svg>)}
        </button>
        {isDropDown && (
        <div className="hamburger-dropdown" onClick={updateDropDownState}>
          <Link className="react-router-links" to="account">Account</Link>
          <div className="middle-divisor"></div>
          <Link className="react-router-links" to="shopping-cart">Shopping Cart</Link>
          <div className="middle-divisor"></div>
          <Link className="react-router-links" to="orders">Order History</Link>
          <div className="middle-divisor"></div>
          {props.isAdmin && (<><Link  className="react-router-links" to="admin-panel">Admin Panel</Link><div className="middle-divisor"></div></>)} 
          <Link  className="react-router-links" to="/" onClick={logOutUser}>LogOut</Link>
        </div>)}
      </div>)}
    </>
  )
}

export default Hamburger;
