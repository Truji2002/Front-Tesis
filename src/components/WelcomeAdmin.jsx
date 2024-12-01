import React, { useState, useEffect } from 'react';
import '../styles/WelcomeAdmin.css';

const WelcomeScreen = () => {
  const [nombre, setNombre] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedNombre = localStorage.getItem('nombre');
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <h1>Bienvenido, {nombre}</h1>
        {message && <p className={`message ${message.type}`}>{message.text}</p>}
      </div>
      <div className="welcome-content">
        <p className="welcome-message">Selecciona una opción del menú para ver su contenido.</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
