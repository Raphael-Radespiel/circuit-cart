import {useState, useEffect} from "react"
import Carousel from "./Carousel"

function Home(){
  const [products, setProducts] = useState([{}]);
  const isLoggedIn = false;
  
  useEffect(() => {
    const request = {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
      body: JSON.stringify({productAmount: 2})
    }

    fetch("./randomproducts", request)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((err) => (console.log(err.message)));

  }, []);

  return(
    <>
      <div className="hero-section">
        <h1>
          Build your next project with ease! 
        </h1>
        <p>
          Our online store offers a vast selection of high-quality electronic components at competitive prices. We provide fast and reliable shipping straight to your door. Whether you're a hobbyist or a professional, we have everything you need to take your projects to the next level, building smarter and faster than ever before.
        </p>
        {!isLoggedIn ? (<button>Join now!</button>) : (<button>Start building!</button>)}
      </div>
      <Carousel>
        {
        products.map((value, index) => {
          return (
          <div className="carousel-item" key={index}>
            <img src={"../../assets/" + value.ImageFile}></img>
            <h2>{value.Title}</h2>
            <p>{value.Price}</p>
          </div>
          )
        })
        }
      </Carousel>
    </>
  )
}

export default Home;
