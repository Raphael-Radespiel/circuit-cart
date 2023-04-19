import { Link } from "react-router-dom"
import ProductListing from "./ProductListing"

import "../../assets/css/Home.css"

function Home({isLoggedIn}){

  return(
    <>
      <div className="hero-section">
        <img src="../../assets/images/Electronic.png"></img>
        <div className="hero-text-content">
          <h1>
            Build your next project with ease! 
          </h1>
          <p>
            Shop now for high-quality electronic components at competitive prices. Build faster and smarter. Perfect for hobbyists and professionals alike.
          </p>
          {
            isLoggedIn ? 
            (
              <Link className="react-router-links primary-button" to="/search">Start building!</Link>
            ) : 
            (
              <Link className="react-router-links primary-button" to="/signup">Join now!</Link>
            )
          }
        </div>
      </div>
      <ProductListing amount="6"/>
    </>
  )
}

export default Home;
