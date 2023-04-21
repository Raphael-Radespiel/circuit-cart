import {getQueryParam} from "../../utils/getQueryParam"

function Products(){

  const productID = getQueryParam('id');

  return (
    <div>
      {productID}
    </div>
  )
}

export default Products;
