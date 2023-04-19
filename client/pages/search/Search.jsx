import { useState, useEffect } from "react";
import {render} from "react-dom";

function Search(){
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

      console.log("EFFECT USED");
      console.log(jsonResult);
      setSearchResults(jsonResult);
    }

    fetchSearchResult();
  }, []);

  function renderSearchResults(){

    if(searchResults.order.length == 0){
      return (
        <h1>NO RESULT FOUND</h1>
      )
    }

    return searchResults.order.map((id) => {
      const value = searchResults.result.find(item => item.ProductID === id);
      console.log(value);
      return (
        <div key={value.ProductID} id={value.ProductID}>
          <img src={"../../assets/images/" + value.ImageFile}/>
          <h2>{value.Title}</h2> 
          <p>{value.Description}</p> 
          <p>{value.Price}</p> 
          <p>{value.AmountInStock}</p> 
        </div>
      )
    })
  }

  return (
    <div>
      {
        renderSearchResults()
      }
    </div>
  )
}


export default Search;

/*
 
          return (
            <div key={value.ProductID} id={value.ProductID}>
              <img src={"../../assets/images/" + value.ImageFile}/>
              <h2>{value.Title}</h2> 
              <p>{value.Description}</p> 
              <p>{value.Price}</p> 
              <p>{value.AmountInStock}</p> 
            </div>
          )
*/
