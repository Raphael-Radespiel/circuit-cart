import Navbar from "./components/Navbar"
import Home from "./pages/home/home"
import "./assets/global.css"

function App() {
  const isLoggedIn = false;

  return (
    <>
      <header>
        <Navbar isLoggedIn={isLoggedIn}/>
      </header>
      <main>
        <Home />
      </main>
    </>
  )
}

export default App
