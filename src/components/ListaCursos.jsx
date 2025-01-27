// src/components/ListaCursos.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert } from './alerts';
import Button from './ui/button/button';
import '../styles/ListaCursos.css';

const ListaCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener los cursos.');
      const data = await response.json();
      
      setCursos(data);
      setLoading(false);
    } catch (error) {
      setError('No se pudieron cargar los cursos.');
      setLoading(false);
      showAlert('Error', 'No se pudieron cargar los cursos.', 'error');
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleVerSubcursos = (cursoId, titulo) => {
    localStorage.setItem('tituloCurso', titulo);
    navigate(`/courses/${cursoId}/subcourses`);
  };

  const handleEditarCurso = (cursoId) => {
    navigate(`/course/edit/${cursoId}`);
  };

  const handleCrearPrueba = (cursoId) => {
    navigate(`/pruebas/create?cursoId=${cursoId}`);
  };

  const handleAdministrarPrueba = (pruebaId) => {
    if (pruebaId) {
      navigate(`/pruebas/admin/${pruebaId}`);
    } else {
      showAlert('Error', 'No se encontró la prueba asociada a este curso.', 'error');
    }
  };

  if (loading) return <div>Cargando cursos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lista-cursos-container">
      {/* Barra estilizada */}
      <div className="bar">
        <h2>Cursos Disponibles</h2>
      </div>

      {/* Botón de crear curso */}
      <div className="create-button-container">
        <Button onClick={() => navigate('/courses/create')} className="primary small-button">
          Crear Nuevo Curso
        </Button>
      </div>

      {/* Grid de cursos */}
      <div className="cursos-grid">
        {cursos.length > 0 ? (
          cursos.map((curso) => {
            
            return (
              <div key={curso.id} className="curso-card">
                {/* Imagen del curso */}
                {curso.imagen && (
                  <div className="curso-imagen">
                    <img src={curso.imagen} alt={`Imagen de ${curso.titulo}`} />
                  </div>
                )}
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>
                <p>
                  <strong>Subcursos:</strong> {curso.cantidadSubcursos}
                </p>
                <div className="curso-actions">
                  <Button
                    onClick={() => handleVerSubcursos(curso.id, curso.titulo)}
                    className="info small-button"
                  >
                    Ver Subcursos
                  </Button>
                  <Button
                    onClick={() => handleEditarCurso(curso.id)}
                    className="warning small-button"
                  >
                    Editar
                  </Button>
                  {curso.has_prueba ? (
                    <Button
                      onClick={() => handleAdministrarPrueba(curso.prueba_id)}
                      className="success small-button"
                    >
                      Administrar Prueba
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleCrearPrueba(curso.id)}
                      className="success small-button"
                    >
                      Crear Prueba
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-cursos">
            <p>No se encontraron cursos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaCursos;
