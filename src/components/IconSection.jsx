import React from 'react';
import { FaLightbulb, FaUsers, FaAward } from 'react-icons/fa';
import '../styles/IconSection.css';

const IconSection = () => (
  <section className="icon-section">
    <div className="icon-item">
      <FaLightbulb className="icon" />
      <h3>Innovación</h3>
      <p>Adoptamos las últimas tecnologías para liderar el futuro.</p>
    </div>
    <div className="icon-item">
      <FaUsers className="icon" />
      <h3>Colaboración</h3>
      <p>Trabajamos juntos para soluciones de alto impacto.</p>
    </div>
    <div className="icon-item">
      <FaAward className="icon" />
      <h3>Compromiso</h3>
      <p>Siempre comprometidos con la excelencia.</p>
    </div>
  </section>
);

export default IconSection;
