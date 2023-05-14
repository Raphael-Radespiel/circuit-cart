import { Link } from "react-router-dom"
import { useState } from "react";

import CloseIcon from "../assets/icons/CloseIcon"
import CogIcon from "../assets/icons/CogIcon"

import "../assets/css/Hamburger.css";

function Hamburger({isLoggedIn, getLoginStatus}){
  const [isDropDown, setDropDown] = useState(false);

  function updateDropDownState(){
    setDropDown(previousBoolean => !previousBoolean);
  }

  function logOutUser(){
    fetch(`/user/logout`, {method: 'GET', credentials: "same-origin"});
    getLoginStatus();
  }

  function renderDropdownLinks(){
    return(
      <div className="hamburger-dropdown" onClick={updateDropDownState}>
        <Link className="react-router-links" to="shopping-cart">Shopping Cart</Link>
        <div className="middle-divisor"></div>
        <Link  className="react-router-links" to="/" onClick={logOutUser}>LogOut</Link>
      </div>
    )
  }

  if(!isLoggedIn){
    return (
      <Link className="react-router-links login-button" to="/login">
        Login
      </Link>
    )
  }
  else{
    return(
      <div className="hamburger">
        {
          isDropDown ?
            (
              <>
              <button onClick={updateDropDownState}>
                <CloseIcon width="27" height="27"/>
              </button>
                {renderDropdownLinks()}
              </>
            ) :
            (
              <button onClick={updateDropDownState}>
                <CogIcon width="27" height="27"/>
              </button>
            )
        }
      </div>
    )
  }
}

export default Hamburger;
