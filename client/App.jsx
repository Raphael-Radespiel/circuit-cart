import Navbar from "./components/Navbar"
import Hamburger from "./components/Hamburger"

import Home from "./pages/home/Home"
import Search from "./pages/search/Search"
import LogIn from "./pages/login/LogIn"
import SignUp from "./pages/signup/SignUp"
import Account from "./pages/account/Account"
import CheckOut from "./pages/checkout/CheckOut"
import Orders from "./pages/orders/Orders"
import Products from "./pages/products/Products"
import ShoppingCart from "./pages/shopping-cart/ShoppingCart"
import AdminPanel from "./pages/admin-panel/AdminPanel"

import "./assets/global.css"

import { Route, Routes } from "react-router-dom"

function App() {
  const userSessionStatus = {isLoggedIn: true, isAdmin: true};

  return (
    <>
      <header>
        <Navbar>
          <Hamburger {...userSessionStatus}/>
        </Navbar>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home {...userSessionStatus}/>}/>

          <Route path="/search" element={<Search/>}/>
          <Route path="/products" element={<Products/>}/>

          <Route path="/login" element={<LogIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>

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
