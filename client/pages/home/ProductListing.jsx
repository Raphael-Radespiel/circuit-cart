import {useState, useEffect} from "react"
import Product from "../../components/Product"

import "../../assets/css/ProductListing.css"

function ProductListing(props){
  const [products, setProducts] = useState([{}]);

  useEffect(() => {
    const request = {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({productAmount: props.amount})
    }

    fetch("./products", request)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => (console.log(err.message)));

  }, [props.forceRenderProp]);

  return (
      <div className="product-listing-container">
          {
            products.map((value, index) => {
              return (
                <Product key={index} {...value}/>
              )
            })
          }
      </div>
  );
}

export default ProductListing;
