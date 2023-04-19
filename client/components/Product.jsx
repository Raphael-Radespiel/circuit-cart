function Product({Title, Price, ProductID, ImageFile, AmountInStock}){
  function numberToPriceString(num){
    if(num == undefined){
      return null;
    }

    return `$${num.toFixed(2)}`;
  }

  return (
    <div>
      <img src={"../assets/images/" + ImageFile}/>
      <div>
        <h2>{Title}</h2>
        <p>Amount: {AmountInStock}</p> 
        <p>{numberToPriceString(Price)}</p>
      </div>
    </div>
  )
}

export default Product;
