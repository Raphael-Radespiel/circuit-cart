import Hamburger from "./Hamburger";
import "../assets/Navbar.css";

function Navbar({isLoggedIn}){
  return(
    <nav>
      <h1 className="no-select">C i r c u i t C a r t</h1>
      <div className="filtered-search">
        <select defaultValue="all">
          <option value="all">All</option>
          <option value="componentes">Componentes</option>          
          <option value="acessórios">Acessórios</option>
          <option value="prototipagem">Prototipagem</option> 
          <option value="ferramentas">Ferramentas</option> 
          <option value="motores">Motores</option> 
          <option value="kits">Kits</option> 
        </select>
        <input type="text" value="Search for Components"></input>
        <button className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>
        </button>
      </div>
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
