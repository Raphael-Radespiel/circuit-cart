import "../assets/Navbar.css"

function Navbar(){
  return(
    <nav>
      <h1>C i r c u i t C a r t</h1>
      <div className="filtered-search">
        <select></select>
        <input type="text"></input>
        <button>Search</button>
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
