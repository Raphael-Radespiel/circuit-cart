import { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom'

import ProductListing from "../home/ProductListing"

import "../../assets/css/ProductPage.css"

import {getQueryParam} from "../../utils/getQueryParam"
import CartIcon from "../../assets/icons/CartIcon"

// TODO:
// MAKE VIEW CART INTO A REACT-ROUTER-DOM LINK
function Products(){
  const [product, setProduct] = useState({});
  const [amount, setAmount] = useState(1);
  const [forceRender, setForceRender] = useState(false);
  const [isOnCart, setIsOnCart] = useState(false);

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

      // Update the product based on if it is in the ShoppingCart 
      const sessionCartItem = sessionStorage.getItem(jsonResult[0].Title);
      setIsOnCart(!!sessionCartItem);
      setAmount(sessionCartItem ? JSON.parse(sessionCartItem).amount : 1);
    }

    fetchProductData();
  }, [location]);

  function addToCart(){
    sessionStorage.setItem(product.Title, JSON.stringify({...product, amount: amount}));
    setIsOnCart(true);
  }

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
          {
            isOnCart ?
            (
              <div className="on-cart__button-container">
                <button className="add-to-cart" onClick={addToCart}>Update Cart!</button>
                <Link to="/shopping-cart" className="react-router-links view-cart" onClick={addToCart}><CartIcon width="30" height="30"/>View Cart</Link>
            </div>
            )
            :
            (
              <button className="add-to-cart" onClick={addToCart}>Add to Cart!</button>
            )
          }  
        </div>
      </div>
      <ProductListing forceRenderProp={forceRender} amount="3"/>
    </>
  )
}

export default Products;
