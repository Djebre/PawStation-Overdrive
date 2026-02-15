import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GrooveOrbitRunner from "@/pages/GrooveOrbitRunner";
import Leaderboard from "@/pages/Leaderboard";
import ComingSoon from "@/pages/ComingSoon";
import About from "@/pages/About";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/groove-orbit-runner" element={<GrooveOrbitRunner />} />
          <Route path="/game/space-groove-drift" element={<ComingSoon gameName="Space Groove Drift" />} />
          <Route path="/game/groove-arena-overdrive" element={<ComingSoon gameName="Groove Arena Overdrive" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;