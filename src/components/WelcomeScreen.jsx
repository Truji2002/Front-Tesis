import React from 'react';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = () => {
  return (
    <div className="welcome-screen">
      {/* Banner principal */}
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1>Global QHSE</h1>
          <p>Excelencia, innovación y compromiso a tu alcance.</p>
        </div>
      </div>

      

      {/* Barra de servicios */}
      <div className="services-bar">
        <div className="services-content">
          <h2>Nuestros Servicios</h2>
          <div className="services-list">
            <div className="service-item">
              <i className="fas fa-chalkboard-teacher service-icon"></i>
              <span>Capacitación Profesional</span>
            </div>
            <div className="service-item">
              <i className="fas fa-laptop service-icon"></i>
              <span>Soluciones Digitales</span>
            </div>
            <div className="service-item">
              <i className="fas fa-lightbulb service-icon"></i>
              <span>Asesoría Empresarial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de contenido */}
      <div className="welcome-content">
        <div className="welcome-cards">
          {/* Tarjeta de Visión */}
          <div className="welcome-card">
            <img
              src="https://hotmart.com/media/2024/02/shutterstock_1854622273.jpg"
              alt="Visión"
            />
            <h3>Visión</h3>
            <p>
              Ser líderes en soluciones digitales, fomentando innovación y excelencia empresarial.
            </p>
          </div>

          {/* Tarjeta de Misión */}
          <div className="welcome-card">
            <img
              src="https://img.freepik.com/fotos-premium/empresaria-asia-usando-computadora-portatil-habla-sus-colegas-sobre-plan-reunion-videollamada-sala-estar-casa-trabajando-sobrecarga-casa-noche-forma-remota-distancia-social-cuarentena-coronavirus_7861-3277.jpg"
              alt="Misión"
            />
            <h3>Misión</h3>
            <p>
              Proveer herramientas tecnológicas accesibles, impulsando eficiencia y sostenibilidad.
            </p>
          </div>

          {/* Tarjeta de Valores */}
          <div className="welcome-card">
            <img
              src="https://www.educaciontrespuntocero.com/wp-content/uploads/2020/10/270-330x220.jpg"
              alt="Valores"
            />
            <h3>Valores</h3>
            <p>
              Innovación, colaboración, y compromiso con el éxito de nuestros clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
