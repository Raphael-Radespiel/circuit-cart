import { Link } from "react-router-dom"
import "../assets/css/Footer.css"

function Footer(){
  return (
    <footer>
      <Link className="react-router-links" to="/">
        <h1 className="no-select">C i r c u i t C a r t</h1>
      </Link>
      <p>Copyright 	&#169; 2023 Raphael Radespiel</p>
    </footer>
  )
}

export default Footer;
