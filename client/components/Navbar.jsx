import { Link } from "react-router-dom"
import Searchbar from "./Searchbar";
import "../assets/Navbar.css";

function Navbar(props){
  return(
    <nav>
      <Link className="react-router-links" to="/">
        <h1 className="no-select">C i r c u i t C a r t</h1>
      </Link>
      <Searchbar/>
      {props.children}
    </nav>
  )
}

export default Navbar;
