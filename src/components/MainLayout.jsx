import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Tu menú lateral
import '../styles/MainLayout.css'; // Los estilos ajustados en el paso 1

const MainLayout = ({ onLogout }) => {
  return (
    <div className="main-layout">
      <Sidebar onLogout={onLogout} /> {/* Menú lateral */}
      <main className="main-content">
        <Outlet />
        <footer className="footer">© 2024 - Global QHSE</footer> {/* Aquí se cargan las pantallas dinámicamente */}
      </main>
    </div>
  );
};

export default MainLayout;
