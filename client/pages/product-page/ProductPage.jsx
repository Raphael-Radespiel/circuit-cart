import { useState, useEffect } from "react";

import ProductListing from "../home/ProductListing"

import "../../assets/css/ProductPage.css"

import {getQueryParam} from "../../utils/getQueryParam"

function Products(){
  const [product, setProduct] = useState({});
  const [amount, setAmount] = useState(1);

  function addAmount(){ 
    setAmount(n => ++n);
  }

  function subtractAmount(){
    if(amount > 1){
      setAmount(n => --n); 
    }
  }

  function numberToPriceString(num){
    if(num == undefined){
      return null;
    }

    return `$${num.toFixed(2)}`;
  }

  useEffect(() => {
    const fetchProductData = async () => {
      const productID = getQueryParam('id');

      const url = `/products/from-id?id=${productID}`;

      const result = await fetch(url, {method: 'GET'});
      const jsonResult = await result.json();

      setProduct(...jsonResult);
    }

    fetchProductData();
  }, []);

  return (
    <>
      <div className="product-page__container">
        <img className="product-page__image" src={"../../assets/images/"+ product.ImageFile}/>
        <div className="product-page__text-content">
          <h2>{product.Title}</h2>
          <p>{product.Description}</p>
          <p className="product-price">{numberToPriceString(product.Price * amount)}</p>
          <p>Amount:</p>
            <div className="amount-button-container">
              <button onClick={subtractAmount}>-</button>
              <p>{String(product.AmountInStock * amount)}</p>
              <button onClick={addAmount}>+</button>
            </div>
          <button className="add-to-cart">Add to Cart!</button>
        </div>
      </div>
      <ProductListing amount="3"/>
    </>
  )
}

export default Products;
