import { useState, useEffect } from "react";
import "../../assets/css/ShoppingCart.css"

function ShoppingCart(){
  const [shoppingCartItems, setShoppingCartItems] = useState([{}]);

  useEffect(() => {

    let shoppingCartArray = [];
    let keys = Object.keys(sessionStorage);

    for(let key of keys) {
      shoppingCartArray.push(JSON.parse(sessionStorage.getItem(key)));
    }

    setShoppingCartItems(shoppingCartArray);
    console.log(shoppingCartArray);

  }, []);

  // TODO: Extract the repeated code and make it cleaner
  function subtractAmount(id){
    let shoppingCartClone = [...shoppingCartItems];
    let indexOfId = shoppingCartClone.findIndex((value) => value.ProductID == id);

    if(shoppingCartClone[indexOfId].amount > 1){
      shoppingCartClone[indexOfId].amount--;
      sessionStorage.setItem(shoppingCartClone[indexOfId].Title, JSON.stringify(shoppingCartClone[indexOfId]));
      setShoppingCartItems(shoppingCartClone);
    }
  }

  function addAmount(id){
    let shoppingCartClone = [...shoppingCartItems];
    let indexOfId = shoppingCartClone.findIndex((value) => value.ProductID == id);

    shoppingCartClone[indexOfId].amount++;
    sessionStorage.setItem(shoppingCartClone[indexOfId].Title, JSON.stringify(shoppingCartClone[indexOfId]));
    setShoppingCartItems(shoppingCartClone);
  }

  function removeFromCart(productKey){
    let shoppingCartClone = [...shoppingCartItems];
    let indexOfId = shoppingCartClone.findIndex((value) => value.Title == productKey);

    sessionStorage.removeItem(productKey);
    shoppingCartClone.splice(indexOfId, 1);
    setShoppingCartItems(shoppingCartClone);
  }

  function numberToPriceString(num){
    if(num == undefined){
      return null;
    }

    return `$${num.toFixed(2)}`;
  }

  return (
    <div className="shopping-cart__container">
      {
        shoppingCartItems.map((value, index) => {
          return(
            <div key={index} className="shopping-cart__item">
              <img src={"../../assets/images/" + value.ImageFile}></img>
              <div className="shopping-cart__text-content">
                <div className="shopping-cart__text-value-div">
                  <h1>{value.Title}</h1> 
                  <p>{numberToPriceString(value.Price * value.amount)}</p>
                </div>
                <div className="shopping-cart__button-div">
                  <div className="shopping-cart__amount-button-container"> 
                    <button onClick={() => subtractAmount(value.ProductID)}>-</button>
                    <p>{String(value.AmountInStock * value.amount)}</p>
                    <button onClick={() => addAmount(value.ProductID)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(value.Title)}>X</button>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ShoppingCart;
