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

      // Update the product based on if it is in the ShoppingCart and how many are in the cart
      // If there isnt an item return
      const storageArray = sessionStorage.getItem("ShoppingCart") ? JSON.parse(sessionStorage.getItem("ShoppingCart")) : [];

      let indexFound = storageArray.findIndex((elem) => {
        return elem.Title == jsonResult[0].Title;
      });

      if(indexFound != -1){
        setIsOnCart(true);
        setAmount(storageArray[indexFound].amount);
      }
      else{
        setIsOnCart(false);
        setAmount(1);
      }
    }

    fetchProductData();
  }, [location]);

  function addToCart(){
    // GET shoppingCart in sessionStorage
    const storageArray = sessionStorage.getItem("ShoppingCart") ? JSON.parse(sessionStorage.getItem("ShoppingCart")) : [];

    // If there is no ShoppingCart item in session Storage
    // create one and populate it with our current product
    if(!storageArray){
      sessionStorage.setItem("ShoppingCart", JSON.stringify([{...product, amount: amount}]));
      return;
    }

    // Find index of product in ShoppingCart item
    let result = storageArray.findIndex((elem) => {
      return elem.Title == product.Title;
    });

    // If Product is in storageArray update it
    // else we push it into the array
    if(result != -1){
      storageArray.splice(result, 1, {...product, amount: amount});
      sessionStorage.setItem("ShoppingCart", JSON.stringify(storageArray));
    }
    else{
      storageArray.push({...product, amount: amount});
      sessionStorage.setItem("ShoppingCart", JSON.stringify(storageArray));
    }

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
                <Link to="/shopping-cart" className="react-router-links view-cart"><CartIcon width="30" height="30"/>View Cart</Link>
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
