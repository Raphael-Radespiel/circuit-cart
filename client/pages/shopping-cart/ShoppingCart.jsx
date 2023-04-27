import { useState, useEffect } from "react";

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
            <div key={index}>
              <img src={"../../assets/images/" + value.ImageFile}></img>
              <div>
                <h1>{value.Title}</h1> 
                <div>
                  <p>{numberToPriceString(value.Price * value.amount)}</p>
                  <div> 
                    <button onClick={() => subtractAmount(value.ProductID)}>-</button>
                    <p>{String(value.AmountInStock * value.amount)}</p>
                    <button onClick={() => addAmount(value.ProductID)}>+</button>
                    <button onClick={() => removeFromCart(value.Title)}>Remove from Cart</button>
                  </div>
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
