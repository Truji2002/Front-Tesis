import React from 'react';
import Header from './Header'; // Importa tu componente Header

import { Outlet } from 'react-router-dom';

const StudentLayout = ({  onLogout }) => {
  return (
    <div className="main-layout">
      <Header onLogout={onLogout} />
      <main className="main-content no-sidebar"> {/* Asegúrate de usar no-sidebar */}
      <Outlet />
        <footer className="footer">© 2025 - Global QHSE</footer>
      </main>
      
    </div>
  );
};

export default StudentLayout;
