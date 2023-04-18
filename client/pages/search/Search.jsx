import { useState, useEffect } from "react";

function Search(){
  const [searchResults, setSearchResults] = useState([]);

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
  }, []);

  return (
    <div>
      {
        searchResults.map((value) => {
          return (
            <div key={value.ProductID}>
              <h2>{value.Title}</h2> 
              <p>{value.Description}</p> 
              <p>{value.Price}</p> 
              <p>{value.AmountInStock}</p> 
            </div>
          )
        })
      }
    </div>
  )
}

export default Search;
