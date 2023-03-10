import Navbar from "./components/Navbar"
import Home from "./pages/home/home"
import "./assets/global.css"

function App() {

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Home />
      </main>
    </>
  )
}

export default App
