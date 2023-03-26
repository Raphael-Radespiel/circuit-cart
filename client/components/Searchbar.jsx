import { Link } from "react-router-dom"
import {useState} from "react";
import "../assets/Searchbar.css";

function Searchbar(){
  const [selectWidth, setSelectWidth] = useState({width: "48px"});
  const [searchColor, setSearchColor] = useState({color: "#F2E7D335"});

  function updateSelectWidth(e){
    // Calculate new select width based on string size
    let newSelectWidth = e.target.value.length * 10 + 18;
    setSelectWidth({width: (newSelectWidth + "px")});
  }

  function updateSearchColor(e){
    if(e.target.value == ""){
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
      <Link className="react-router-links" to="/search">
        <button className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>
        </button>
      </Link>
    </div>
  )
}

export default Searchbar;
