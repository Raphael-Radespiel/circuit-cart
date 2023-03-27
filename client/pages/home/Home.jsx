import {useState, useEffect} from "react"
import Carousel from "./Carousel"
import "../../assets/Home.css"

function Home(props){
  const [products, setProducts] = useState([{}]);

  const carouselProductsAmount = 5;
  
  useEffect(() => {
    const request = {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
      body: JSON.stringify({productAmount: carouselProductsAmount})
    }

    fetch("./randomproducts", request)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => (console.log(err.message)));

  }, []);

  return(
    <>
      <div className="hero-section">
        <img src="../../assets/images/Electronic.png"></img>
        <div className="hero-text-content">
          <h1>
            Build your next project with ease! 
          </h1>
          <p>
            Our online store offers a vast selection of high-quality electronic components at competitive prices with fast and reliable shipping straight to your door. Hobbyist or professional, we have everything you need to take your projects to the next level, building smarter and faster than ever before.
          </p>
          {!props.isLoggedIn ? (<button>Join now!</button>) : (<button>Start building!</button>)}
        </div>
      </div>
      <Carousel products={products} productCenter={Math.floor((products.length - 1) / 2)}/>
    </>
  )
}

export default Home;
