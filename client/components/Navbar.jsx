import Hamburger from "./Hamburger";
import "../assets/Navbar.css";

function Navbar({isLoggedIn}){
  return(
    <nav>
      <div className="navbar-left">
        <h1>C i r c u i t C a r t</h1>
        <div className="filtered-search">
          <select></select>
          <input type="text"></input>
          <button>Search</button>
        </div>
      </div>
      <div className="navbar-right">
        {!isLoggedIn?
            (
              <button>LogIn</button>
            ):
            (
              <Hamburger />
            )
        }
      </div>
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
