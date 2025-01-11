import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Menú lateral
import Header from "./Header"; // Importar el Header
import "../styles/MainLayout.css"; // Estilos ajustados

const MainLayout = ({ onLogout }) => {
  const role = localStorage.getItem("rol"); // Obtener el rol del usuario desde localStorage

  return (
    <div className="main-layout">
      <Header onLogout={onLogout} /> {/* Header siempre en la parte superior */}
      <div className="layout-body">
        {role !== "estudiante" && <Sidebar />} {/* Sidebar solo para roles diferentes de estudiante */}
        <main className={`main-content ${role === "estudiante" ? "no-sidebar" : ""}`}>
          <Outlet /> {/* Renderizar rutas hijas */}
          <footer className="footer">© 2025 - Global QHSE</footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
