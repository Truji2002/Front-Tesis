// src/components/CrearCurso.jsx

import React from 'react';
import CursoForm from './CursoForm';
import { useNavigate } from 'react-router-dom';
import { showAlert } from './alerts';
import '../styles/CrearCurso.css'; // Asegúrate de que la ruta sea correcta

const CrearCurso = () => {
  const navigate = useNavigate();

  const handleCrearCurso = () => {
    // Después de crear el curso, redirige a la lista o a otra vista
    showAlert('Éxito', 'Curso creado con éxito.', 'success');
    navigate('/courses/list'); // Ajusta la ruta según tu navegación
  };

  return (
    <div className="crear-curso-page">
      <div className="crear-curso-header">
       
      </div>
      <div className="crear-curso-form-container">
        <CursoForm isEdit={false} onSubmit={handleCrearCurso} />
        <div className="crear-curso-button-container">
        
        </div>
      </div>
    </div>
  );
};

export default CrearCurso;
