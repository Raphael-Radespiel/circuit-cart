import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react";

import SearchIcon from "../assets/icons/SearchIcon"

import "../assets/css/Searchbar.css";

// UNDER 54REM 
// CHANGE SEARCHBAR THINGS

function Searchbar({fetchSearch, setNavbarClass}){
  const WINDOW_BREAKPOINT = 864;
  const [selectWidth, setSelectWidth] = useState({width: "48px"});
  const [searchColor, setSearchColor] = useState({color: "#F2E7D335"});
  const [searchLink, setSearchLink] = useState("/search");
  const [searchType, setSearchType] = useState((window.innerWidth < WINDOW_BREAKPOINT) ? "mobile" : "desktop");
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  const filterRef = useRef("");
  const inputRef = useRef("");

  window.addEventListener("resize", () => {
    if(window.innerWidth < WINDOW_BREAKPOINT && searchType != "mobile"){
      setSearchType("mobile");
    }
    else if(window.innerWidth >= WINDOW_BREAKPOINT && searchType != "desktop"){
      setSearchType("desktop");
    }
  });

  useEffect(() => {
    setSearchLink(`/search?filter=${filterRef.current.value}&search=${inputRef.current.value}`);
  }, [filterRef.current.value, inputRef.current.value]);

  // Calculate an approximate width for select box based on value selected
  function updateSelectWidth(e){
    let newSelectWidth = `${e.target.value.length * 10 + 18}px`;
    setSelectWidth({width: newSelectWidth});
  }

  function updateSearchColor(e){
    if(e.target.value === ""){
      setSearchColor({color: "#F2E7D335"});
    }
    else{
      setSearchColor({color: "#F2E7D3"});
    }
  }

  return (
    <div className="filtered-search">
      <select defaultValue="all" ref={filterRef} style={selectWidth} onChange={e => updateSelectWidth(e)}>
        <option value="all">All</option>
        <option value="component">Component</option>          
        <option value="accessory">Accessory</option>
        <option value="prototyping">Prototyping</option> 
        <option value="tool">Tool</option> 
        <option value="motor">Motor</option> 
        <option value="kit">Kit</option> 
      </select>
      {
        isMobileSearchOpen && 
      <button onClick={() => {setNavbarClass(""); setMobileSearchOpen(false);}}>
        x
      </button>
      }
      <input type="text" ref={inputRef} style={searchColor} placeholder="Search for Components" onChange={e => updateSearchColor(e)}/>
      {
      (searchType == "desktop") 
        ?
        <Link className="react-router-links search-button" onClick={() => fetchSearch({filter: filterRef.current.value, search: inputRef.current.value})} to={searchLink}>
          <SearchIcon width="27" height="27"/>
        </Link>
        :
        (
          (!isMobileSearchOpen) 
            ?
            <button className="search-button" onClick={() => {setNavbarClass("mobile-searchbar--open"); setMobileSearchOpen(true);}}>
              <SearchIcon width="27" height="27"/>
            </button>
            :
        <Link className="react-router-links search-button" onClick={() => fetchSearch({filter: filterRef.current.value, search: inputRef.current.value})} to={searchLink}>
          <SearchIcon width="27" height="27"/>
        </Link>
        )
      }
    </div>
  )
}

export default Searchbar;
