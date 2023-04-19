import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react";

import SearchIcon from "../assets/icons/SearchIcon"

import "../assets/css/Searchbar.css";

function Searchbar({fetchSearch}){
  const [selectWidth, setSelectWidth] = useState({width: "48px"});
  const [searchColor, setSearchColor] = useState({color: "#F2E7D335"});
  const [searchLink, setSearchLink] = useState("/search");

  const filterRef = useRef("");
  const inputRef = useRef("");

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
        <option value="component">Componentes</option>          
        <option value="accessory">Acessórios</option>
        <option value="prototyping">Prototipagem</option> 
        <option value="tool">Ferramentas</option> 
        <option value="motor">Motores</option> 
        <option value="kit">Kits</option> 
      </select>
      <input type="text" ref={inputRef} style={searchColor} placeholder="Search for Components" onChange={e => updateSearchColor(e)}/>
      <Link className="react-router-links search-button" onClick={() => fetchSearch({filter: filterRef.current.value, search: inputRef.current.value})} to={searchLink}>
        <SearchIcon width="27" height="27"/>
      </Link>
    </div>
  )
}

export default Searchbar;
