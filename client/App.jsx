import Navbar from "./components/Navbar"
import Home from "./pages/home/Home"
import "./assets/global.css"

function App() {
  const userSessionStatus = {isLoggedIn: true, isAdmin: true};

  return (
    <>
      <header>
        <Navbar {...userSessionStatus}/>
      </header>
      <main>
        <Home />
      </main>
    </>
  )
}

export default App
