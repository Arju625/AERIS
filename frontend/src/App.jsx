import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Emergency from "./Emergency";
import Auth from "./pages/Auth";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/features" element={<Features />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;