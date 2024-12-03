import React from 'react';
import CursoForm from './CursoForm';
import { useNavigate } from 'react-router-dom';
import { showAlert } from './alerts';

const CrearCurso = () => {
  const navigate = useNavigate();

  const handleCrearCurso = () => {
    // Después de crear el curso, redirige a la lista o a otra vista
    showAlert('Éxito', 'Curso creado con éxito.', 'success');
    navigate('/administrar-cursos'); // Ajusta la ruta según tu navegación
  };

  return (
    <div className="crear-curso-container">
      <CursoForm isEdit={false} onSubmit={handleCrearCurso} />
    </div>
  );
};

export default CrearCurso;
