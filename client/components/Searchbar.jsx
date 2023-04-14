import { Link } from "react-router-dom"
import {useState} from "react";

import SearchIcon from "../assets/icons/SearchIcon"

import "../assets/css/Searchbar.css";

function Searchbar(){
  const [selectWidth, setSelectWidth] = useState({width: "48px"});
  const [searchColor, setSearchColor] = useState({color: "#F2E7D335"});

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
      <select defaultValue="all" style={selectWidth} onChange={e => updateSelectWidth(e)}>
        <option value="all">All</option>
        <option value="componentes">Componentes</option>          
        <option value="acessórios">Acessórios</option>
        <option value="prototipagem">Prototipagem</option> 
        <option value="ferramentas">Ferramentas</option> 
        <option value="motores">Motores</option> 
        <option value="kits">Kits</option> 
      </select>
      <input type="text" style={searchColor} placeholder="Search for Components" onChange={e => updateSearchColor(e)}></input>
      <Link className="react-router-links search-button" to="/search">
        <SearchIcon width="27" height="27"/>
      </Link>
    </div>
  )
}

export default Searchbar;
