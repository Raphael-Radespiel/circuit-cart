import {useState, useEffect} from "react";
import "../../assets/Carousel.css"

function Carousel({products, productCenter}){
  const [currentIndex, setCurrentIndex] = useState(productCenter);

  return (
      <div className="product-carousel">
        <button>&#60;</button>
        {
        products.map((value, index) => {
          let carouselItemClassName = "product-carousel__hidden";

          if(index == currentIndex - 1 || index == currentIndex + 1){
            carouselItemClassName = "product-carousel__surrounding"; 
          }

          if(index == currentIndex){
            carouselItemClassName = "product-carousel__current";
          }

          return (
            <div className={carouselItemClassName} key={index}>
              <img src={"../../assets/images/" + value.ImageFile}></img>
              <h2>{value.Title}</h2>
              <p>{value.Price}</p>
            </div>
          )
        })
        }
        <button>&#62;</button>
      </div>
  );
}

export default Carousel;
