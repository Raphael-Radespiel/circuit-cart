import Hamburger from "./Hamburger";
import Searchbar from "./Searchbar";
import "../assets/Navbar.css";

function Navbar({isLoggedIn}){

  return(
    <nav>
      <h1 className="no-select">C i r c u i t C a r t</h1>
      <Searchbar/>
      {!isLoggedIn?
          (
            <button className="login-button">Login</button>
          ):
          (
            <Hamburger />
          )
      }
      {/* 
        USER SETTINGS SECTION
        JUST A LOG IN BUTTON IF NOT LOGGED IN
        CART AND PURCHASES AND ACCOUNT INFO IF LOGGED IN
        AND ADMIN PANEL IF USER IS THE ADMIN
      */}
    </nav>
  )
}

export default Navbar;
