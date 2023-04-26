import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'

import ProductListing from "../home/ProductListing"

import "../../assets/css/ProductPage.css"

import {getQueryParam} from "../../utils/getQueryParam"

// TODO: 
// REMOVE QUERYING OF THE PRODUCT ID
// IN FACT, JUST REMOVE THE QUERYING AND URL CHANGING IN GENERAL? NO, NOT REALLY, ITS USEFUL FOR
// GOING BACK AND FORTH
// I NEED TO MAKE IT SO THAT WHEN WE CHANGE PAGES IT RELOADS THE PRODUCT LISTING
// TODO:
// JUST MAKE IT UPDATE THE PRODUCT LISTING WHEN WE UPDATE OUR 
// DATA
function Products(){
  const [product, setProduct] = useState({});
  const [amount, setAmount] = useState(1);
  const [forceRender, setForceRender] = useState(false);

  const location = useLocation();

  function addAmount(){ 
    setAmount(n => ++n);
  }

  function subtractAmount(){
    if(amount > 1){
      setAmount(n => --n); 
    }
  }

  // TODO:
  // MAKE THIS A UTIL FUNCTION
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
      setAmount(1);
      window.scrollTo(0,0);
      setForceRender(value => !value);
    }

    fetchProductData();
  }, [location]);

  return (
    <>
      <div className="product-page__container">
        <img className="product-page__image" src={"../../assets/images/"+ product.ImageFile}/>
        <div className="product-page__text-content">
          <h2>{product.Title}</h2>
          <p>{product.Description}</p>
          <p className="product-price">{numberToPriceString(product.Price * amount)}</p>
          <div className="amount-button-container">
            <button onClick={subtractAmount}>-</button>
            <p>{String(product.AmountInStock * amount)}</p>
            <button onClick={addAmount}>+</button>
          </div>
          <button className="add-to-cart">Add to Cart!</button>
        </div>
      </div>
      <ProductListing forceRenderProp={forceRender} amount="3"/>
    </>
  )
}

export default Products;
