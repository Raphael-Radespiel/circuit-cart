import Navbar from "./components/Navbar"
import Hamburger from "./components/Hamburger";
import Home from "./pages/home/Home"
import "./assets/global.css"

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
        <Home />
      </main>
    </>
  )
}

export default App
