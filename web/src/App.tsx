import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./page/Home"
import Dashboard from "./page/Dashboard"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App