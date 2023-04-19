import { useState, useEffect } from "react";

function Search({searchQuery}){
  const [searchResults, setSearchResults] = useState({result: [], order: []});

  useEffect(() => {
    async function fetchSearchResult(){
      const url = `/search?filter=${searchQuery.filter}&search=${searchQuery.search}`;
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
