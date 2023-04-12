import { useState, useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import Hamburger from "./components/Hamburger"

import Home from "./pages/home/Home"
import Search from "./pages/search/Search"
import LogIn from "./pages/login/LogIn"
import Validate from "./pages/validate/Validate"
import SignUp from "./pages/signup/SignUp"
import Account from "./pages/account/Account"
import CheckOut from "./pages/checkout/CheckOut"
import Orders from "./pages/orders/Orders"
import Products from "./pages/products/Products"
import ShoppingCart from "./pages/shopping-cart/ShoppingCart"
import AdminPanel from "./pages/admin-panel/AdminPanel"

import "./assets/css/global.css"

function App() {
  const [userSession, setUserSession] = useState({isLoggedIn: false, isAdmin: false});

  useEffect(() => {
    isLoggedIn();
  }, []);

  async function isLoggedIn(){
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

  return (
    <>
      <header>
        <Navbar>
          <Hamburger {...userSession} changeUserStatus={isLoggedIn}/>
        </Navbar>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home {...userSession}/>}/>

          <Route path="/search" element={<Search/>}/>
          <Route path="/products" element={<Products/>}/>

          <Route path="/login" element={<LogIn changeUserStatus={isLoggedIn}/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/validate" element={<Validate changeUserStatus={isLoggedIn}/>}/>

          <Route path="/account" element={<Account/>}/>
          <Route path="/shopping-cart" element={<ShoppingCart/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/checkout" element={<CheckOut/>}/>

          <Route path="/admin-panel" element={<AdminPanel/>}/>
        </Routes>
      </main>
    </>
  )
}

export default App
