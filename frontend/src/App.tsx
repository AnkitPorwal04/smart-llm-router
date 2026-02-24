import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RouterPage from "./components/RouterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/router" element={<RouterPage />} />
    </Routes>
  );
}
