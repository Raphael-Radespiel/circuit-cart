import {useState} from "react";
import "../../assets/Carousel.css"

function Carousel({products, productCenter}){
  const [currentIndex, setCurrentIndex] = useState(productCenter);

  return (
      <div className="product-carousel">
        <button>&#60;</button>
        {
        products.map((value, index) => {
          let carouselItemClassName = "product-carousel__item";

          if(index == currentIndex - 1 || index == currentIndex + 1){
            carouselItemClassName += " product-carousel__item--surrounding"; 
          }
          else if(index == currentIndex){
            carouselItemClassName += " product-carousel__item--current";
          }
          else{
            carouselItemClassName += " product-carousel__item--hidden";
          }

          return (
            <div className={carouselItemClassName} key={index}>
              <img src={"../../assets/images/" + value.ImageFile}></img>
              <div className="product-carousel__item__text-content">
                <h2>{value.Title}</h2>
                <p>{value.Price}</p>
              </div>
            </div>
          )
        })
        }
        <button>&#62;</button>
      </div>
  );
}

export default Carousel;
