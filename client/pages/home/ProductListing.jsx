import "../../assets/css/ProductListing.css"

function ProductListing({products}){

  function numberToPriceString(num){
    if(num == undefined){
      return null;
    }

    return `R$${num.toFixed(2)}`;
  }

  return (
      <div className="product-listing-container">
          {
          products.map((value, index) => {
            return (
              <div key={index} className="product-listing__item">
                <img src={"../../assets/images/" + value.ImageFile}></img>
                <div className="product-listing__content">
                  <h2>{value.Title}</h2>
                  <p>{numberToPriceString(value.Price)}</p>
                </div>
              </div>
            )
          })
          }
      </div>
  );
}

export default ProductListing;
