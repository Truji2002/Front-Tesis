import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormInstructor from './FormInstructor';
import { showAlert } from './alerts';

const EditarInstructor = () => {
  const { id } = useParams(); // ID del instructor desde la URL
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener el token desde localStorage
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/instructores/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('No se pudo cargar la información del instructor.');

        const data = await response.json();
        const responseCursos = await fetch(
          `http://127.0.0.1:8000/api/instructor-curso/?instructor=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!responseCursos.ok) throw new Error('No se pudieron cargar los cursos asociados.');
  
        const cursosData = await responseCursos.json();
        const cursosSeleccionados = cursosData.map((curso) => curso.curso);
  
        // Actualizar el estado del instructor con los cursos seleccionados
        setInstructor({ ...data, cursosSeleccionados });
      } catch (error) {
        showAlert('Error', 'No se pudo cargar la información del instructor.', 'error');
        navigate('/instructors'); // Redirige en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id, navigate, token]);

  const handleFormSubmit = () => {
    showAlert('Éxito', 'El instructor fue actualizado con éxito.', 'success');
    navigate('/instructors'); // Redirigir a la lista de instructores
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="editar-instructor-container">
      {instructor ? (
        <FormInstructor instructor={instructor} isEdit={true} onSubmit={handleFormSubmit} />
      ) : (
        <p>No se encontró el instructor.</p>
      )}
    </div>
  );
};

export default EditarInstructor;
