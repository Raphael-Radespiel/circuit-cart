import {useState, useEffect} from "react"

import "../../assets/css/ProductListing.css"

function ProductListing({amount}){
  const [products, setProducts] = useState([{}]);

  function numberToPriceString(num){
    if(num == undefined){
      return null;
    }

    return `R$${num.toFixed(2)}`;
  }

  useEffect(() => {
    const request = {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({productAmount: amount})
    }

    fetch("./products", request)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => (console.log(err.message)));

  }, []);

  return (
      <div className="product-listing-container">
          {
          products.map((value, index) => {
            return (
              <div key={index} className="product-listing__item">
                <img src={"../../assets/images/" + value.ImageFile}/>
                <div className="product-listing__content">
                  <h2>{value.Title}</h2>
                  <p>{numberToPriceString(value.Price)}</p>
                </div>
              </div>
            )
          })
          }
      </div>
  );
}

export default ProductListing;
