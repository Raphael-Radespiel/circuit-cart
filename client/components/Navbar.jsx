import { Link } from "react-router-dom"
import "../assets/css/Navbar.css";

function Navbar(props){
  return(
    <nav className={props.className}>
      <Link className="react-router-links" to="/">
        <h1 className="no-select">C i r c u i t C a r t</h1>
      </Link>
      {props.children}
    </nav>
  )
}

export default Navbar;
