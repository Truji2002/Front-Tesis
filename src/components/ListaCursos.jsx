import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert } from './alerts';
import Button from './ui/button/button';
import '../styles/ListaCursos.css';

const ListaCursos = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener los cursos.');
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      showAlert('Error', 'No se pudieron cargar los cursos.', 'error');
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleVerSubcursos = (cursoId, titulo) => {
    localStorage.setItem('tituloCurso', titulo); // Guardar en localStorage
    navigate(`/courses/${cursoId}/subcourses`);
  };

  const handleEditarCurso = (cursoId) => {
    navigate(`/course/edit/${cursoId}`);
  };

  return (
    <div className="lista-cursos-container">
      <h2>Lista de Cursos</h2>
      <Button onClick={() => navigate('/courses/create')} className="primary">
        Crear Curso
      </Button>
      <table className="cursos-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Cantidad de Subcursos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.length > 0 ? (
            cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.titulo}</td>
                <td>{curso.descripcion}</td>
                <td>{curso.cantidadSubcursos}</td>
                <td>
                  <Button
                    onClick={() => handleVerSubcursos(curso.id,curso.titulo)}
                    className="info"
                  >
                    Ver Subcursos
                  </Button>
                  <Button
                    onClick={() => handleEditarCurso(curso.id)}
                    className="warning"
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron cursos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCursos;
