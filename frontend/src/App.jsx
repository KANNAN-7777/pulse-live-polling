import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // <-- Import the Navbar
import Home from "./pages/Home";
import Results from "./pages/Results";
import Vote from "./pages/Vote";
import CreatePoll from "./pages/CreatePoll";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SharePoll from "./pages/SharePoll";
function App() {
  return (
    <BrowserRouter>
      {/* Navbar sits above all routes so it's always visible */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/share/:id" element={<SharePoll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;