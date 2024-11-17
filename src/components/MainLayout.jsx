// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';

// const MainLayout = ({ onLogout }) => {
//   const [message, setMessage] = useState('');

//   return (
//     <div className="main-layout">
//       <Sidebar onLogout={onLogout} />
//       <main className="main-content">
//         {/* Muestra el mensaje en la parte superior */}
//         {message && <p className={`message ${message.type}`}>{message.text}</p>}
//         {/* Pasa automáticamente setMessage a las pantallas hijas */}
//         <Outlet context={{ setMessage }} />
//       </main>
//     </div>
//   );
// };

// export default MainLayout;
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
