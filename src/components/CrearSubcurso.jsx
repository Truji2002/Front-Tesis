import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubcursoForm from './SubcursoForm';
import '../styles/CrearSubcurso.css';

const CrearSubcurso = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(-1); // Navega de vuelta
  };

  return (
    <div className="crear-subcurso-page">
      {/* Encabezado */}
      

      {/* Contenedor del formulario */}
      <div className="crear-subcurso-form-container">
        <SubcursoForm onSubmit={handleSubmit} isEdit={false} />
      </div>
    </div>
  );
};

export default CrearSubcurso;
