import { useState, useEffect } from "react"

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

import "./assets/global.css"

import { Route, Routes } from "react-router-dom"

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function App() {
  const [userSession, setUserSession ]= useState({isLoggedIn: false, isAdmin: false});

  useEffect(() => {
    isLoggedIn();
  }, []);

  async function isLoggedIn(){
    console.log("code ran");
    if(userSession.isLoggedIn){
      return;
    }

    if(document.cookie != ""){
      const email = getCookie('email');
      const response = await fetch(`/validate/session/${email}`, {method: 'GET', credentials: "same-origin"});
      const responseJson = await response.json();
      setUserSession(responseJson);
    }
  };

  return (
    <>
      <header>
        <Navbar>
          <Hamburger {...userSession}/>
        </Navbar>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home {...userSession}/>}/>

          <Route path="/search" element={<Search/>}/>
          <Route path="/products" element={<Products/>}/>

          <Route path="/login" element={<LogIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/validate" element={<Validate/>}/>

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
