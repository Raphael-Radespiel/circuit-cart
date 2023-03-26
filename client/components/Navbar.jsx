import Searchbar from "./Searchbar";
import "../assets/Navbar.css";

function Navbar(props){
  console.log(props);
  // THIS IS PROP DRILLING

  return(
    <nav>
      <h1 className="no-select">C i r c u i t C a r t</h1>
      <Searchbar/>
      {props.children}
    </nav>
  )
}

export default Navbar;
