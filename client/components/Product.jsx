import { Link } from "react-router-dom"

import "../assets/css/Product.css"

function Product({Title, Price, ProductID, ImageFile, AmountInStock}){
  function numberToPriceString(num){
    if(num == undefined){
      return null;
    }

    return `$${num.toFixed(2)}`;
  }

  return (
    <Link className="react-router-links product-container" state={{ProductID: ProductID}} to={"/product?id=" + ProductID}>
      <img src={"../assets/images/" + ImageFile}/>
      <div>
        <h2>{Title}</h2>
        <p className="product-container__price">{numberToPriceString(Price)}</p>
        <p className="product-container__amount">Amount: {AmountInStock}</p> 
      </div>
    </Link>
  )
}

export default Product;
