import { useState, useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import Searchbar from "./components/Searchbar";
import Hamburger from "./components/Hamburger"

import Home from "./pages/home/Home"
import Search from "./pages/search/Search"
import LogIn from "./pages/login/LogIn"
import Validate from "./pages/validate/Validate"
import SignUp from "./pages/signup/SignUp"
import ProductPage from "./pages/product-page/ProductPage"
import ShoppingCart from "./pages/shopping-cart/ShoppingCart"

import "./assets/css/global.css"

function App() {
  const [userSession, setUserSession] = useState({isLoggedIn: false, isAdmin: false});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getLoginStatus();
  }, []);

  async function getLoginStatus(){
    if(document.cookie != ""){
      const response = await fetch(`/validate/session`, 
        {method: 'GET', credentials: "same-origin"});
      const responseJson = await response.json();
      setUserSession(responseJson);
    }
    else{
      setUserSession({isLoggedIn: false, isAdmin: false});
    }
  };

  function fetchSearch(queryString){
    setSearchQuery(queryString);
  }

  return (
    <>
      <header>
        <Navbar>
          <Searchbar fetchSearch={fetchSearch}/>
          <Hamburger {...userSession} getLoginStatus={getLoginStatus}/>
        </Navbar>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={userSession.isLoggedIn}/>}/>
          <Route path="/search" element={<Search searchQuery={searchQuery}/>}/>
          <Route path="/product" element={<ProductPage/>}/>
          <Route path="/login" element={<LogIn getLoginStatus={getLoginStatus}/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/validate" element={<Validate getLoginStatus={getLoginStatus}/>}/>
          <Route path="/shopping-cart" element={<ShoppingCart/>}/>
        </Routes>
      </main>
    </>
  )
}

export default App
