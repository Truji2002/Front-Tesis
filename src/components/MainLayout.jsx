import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Tu menú lateral
import Header from './Header'; // Importar el Header
import '../styles/MainLayout.css'; // Los estilos ajustados

const MainLayout = ({ onLogout }) => {
  const role = localStorage.getItem('rol'); // Obtener el rol del usuario (suponiendo que se guarda en localStorage)

  return (
    <div className="main-layout">
      <Header  onLogout={onLogout} /> {/* El Header siempre en la parte superior */}
      <div className="layout-body">
        {role !== 'estudiante' && <Sidebar  />} {/* Sidebar debajo del Header */}
        <main className={`main-content ${role === 'estudiante' ? 'no-sidebar' : ''}`}>
          <Outlet />
          <footer className="footer">© 2024 - Global QHSE</footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
