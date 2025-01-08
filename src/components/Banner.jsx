import React from 'react';
import '../styles/Banner.css';

const Banner = ({ nombre }) => (
  <section className="banner">
    <h1>Bienvenido, {nombre || "Usuario"}</h1>
    <p>Explora nuestras herramientas y lleva tu organización al siguiente nivel.</p>
  </section>
);

export default Banner;
