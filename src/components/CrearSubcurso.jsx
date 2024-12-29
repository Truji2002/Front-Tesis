import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubcursoForm from './SubcursoForm';

const CrearSubcurso = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Navega de vuelta a la lista de subcursos después de crear
    navigate(-1); // O navega a una ruta específica, como `/cursos/:id/subcursos`
  };

  return (
    <div className="crear-subcurso-container">
      <SubcursoForm onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
};

export default CrearSubcurso;