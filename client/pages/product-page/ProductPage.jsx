import { useState, useEffect } from "react";
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
    <div>
      <img src={"../../assets/images/"+ product.ImageFile}/>
      <div>
        <h1>{product.Title}</h1>
        <p>{product.Description}</p>
        <div>
          <p>{numberToPriceString(product.Price * amount)}</p>
          <div>
            <button onClick={subtractAmount}>-</button>
            <p>{String(product.AmountInStock * amount)}</p>
            <button onClick={addAmount}>+</button>
          </div>
        </div>
        <button>Add to Cart!</button>
      </div>
    </div>
  )
}

export default Products;
