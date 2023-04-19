import { useState, useEffect } from "react";
import Product from "../../components/Product"

import "../../assets/css/Search.css"

function Search({searchQuery}){
  const [searchResults, setSearchResults] = useState({result: [], order: []});

  // THIS WILL HAVE TO BE A UTIL FUNCTION BECAUSE VALIDATE.jsx USES IT
  function getQueryParam(param) {
    const rx = new RegExp("[?&]" + param + "=([^&]+).*$");
    const returnVal = String(window.location).match(rx);
    return returnVal === null ? "" : returnVal[1];
  } 

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

  // TURN THIS INTO A REGULAR IF ELSE RENDER
  function renderSearchResults(){
    if(searchResults.order.length == 0){
      return (
        <h1>NO RESULT FOUND</h1>
      )
    }

    return searchResults.order.map((id) => {
      const value = searchResults.result.find(item => item.ProductID === id);
      return (
        <Product key={value.ProductID} {...value}/>
      )
    })
  }

  return (
    <div className="search-container">
      {
        renderSearchResults()
      }
    </div>
  )
}


export default Search;
