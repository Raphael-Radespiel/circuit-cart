import "../assets/Navbar.css"

function Navbar(){
  return(
    <nav>
      <h1>Circuit Cart</h1>
      <select></select>
      <input type="text"></input>
      <button>Search</button>
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
