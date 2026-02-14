import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GrooveOrbitRunner from "@/pages/GrooveOrbitRunner";
import Leaderboard from "@/pages/Leaderboard";
import ComingSoon from "@/pages/ComingSoon";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;