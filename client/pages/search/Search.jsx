import { useState, useEffect } from "react";
import Product from "../../components/Product"
import {getQueryParam} from "../../utils/getQueryParam"

import "../../assets/css/Search.css"

function Search({searchQuery}){
  const [searchResults, setSearchResults] = useState({result: [], order: []});

  useEffect(() => {
    async function fetchSearchResult(){
      const filter = getQueryParam('filter');
      const search = getQueryParam('search');

      const url = `/search?filter=${filter}&search=${search}`;

      const result = await fetch(url, {method: 'GET'});
      const jsonResult = await result.json();

      setSearchResults(jsonResult);
    }

    fetchSearchResult();
  }, [searchQuery]);

  if(searchResults.order.length == 0){
    return (
      <div className="search-container">
      </div>
    )
  }
  else{
    return (
      <div className="search-container">
        {
          searchResults.order.map((id) => {
            const value = searchResults.result.find(item => item.ProductID === id);
            return (<Product key={value.ProductID} {...value}/>)
          })
        }
      </div>
    )
  }
}


export default Search;
