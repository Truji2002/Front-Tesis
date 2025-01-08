import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css'; // Importar estilos

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    localStorage.clear();
    navigate('/login');
  };

  const handleUserProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-actions">
          <button className="user-icon" onClick={handleUserProfile}>
            <FaUserCircle size={30} />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
