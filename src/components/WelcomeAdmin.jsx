import React, { useState, useEffect } from 'react';
import '../styles/WelcomeAdmin.css';

const WelcomeScreen = () => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const storedNombre = localStorage.getItem('nombre');
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  return (
    <div className="welcome-screen">
      {/* Banner principal */}
      <div className="welcome-banner">
        <h1>Global QHSE</h1>
        <p>Explora nuestras herramientas para alcanzar el éxito.</p>
      </div>

      {/* Sección de tarjetas */}
      <div className="welcome-content">
        <div className="welcome-card">
          <img
            src="https://hotmart.com/media/2024/02/shutterstock_1854622273.jpg"
            alt="Visión"
          />
          <h2>Visión</h2>
          <p>
            Ser líderes en soluciones digitales, fomentando innovación y excelencia empresarial.
          </p>
        </div>

        <div className="welcome-card">
          <img
            src="https://img.freepik.com/fotos-premium/empresaria-asia-usando-computadora-portatil-habla-sus-colegas-sobre-plan-reunion-videollamada-sala-estar-casa-trabajando-sobrecarga-casa-noche-forma-remota-distancia-social-cuarentena-coronavirus_7861-3277.jpg"
            alt="Misión"
          />
          <h2>Misión</h2>
          <p>
            Proveer herramientas tecnológicas accesibles, impulsando eficiencia y sostenibilidad.
          </p>
        </div>

        <div className="welcome-card">
          <img
            src="https://www.educaciontrespuntocero.com/wp-content/uploads/2020/10/270-330x220.jpg"
            alt="Valores"
          />
          <h2>Valores</h2>
          <p>
            Innovación, colaboración, y compromiso con el éxito de nuestros clientes.
          </p>
        </div>
      </div>

      {/* Sección de íconos */}
      <div className="icon-section">
        <div className="icon-item">
          <i className="fas fa-lightbulb"></i>
          <h3>Innovación</h3>
          <p>Adoptamos las últimas tecnologías para el futuro.</p>
        </div>
        <div className="icon-item">
          <i className="fas fa-people-arrows"></i>
          <h3>Colaboración</h3>
          <p>Trabajamos juntos para soluciones perfectas.</p>
        </div>
        <div className="icon-item">
          <i className="fas fa-check-circle"></i>
          <h3>Compromiso</h3>
          <p>Siempre comprometidos con la calidad.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
