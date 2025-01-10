import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VistaEstudiante from "./components/VistaEstudiante"; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
      <Routes>
        {/* Otras rutas */}
        <Route path="/estudiante" element={<VistaEstudiante />} />
      </Routes>
    </Router>
  );
}

export default App;
