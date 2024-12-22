import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EstudianteDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [selectedSubcourseIndex, setSelectedSubcourseIndex] = useState(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/estudiante/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Error al cargar el dashboard del estudiante.');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError('No se pudo cargar la información del estudiante.');
      }
    };
    fetchData();
  }, [token]);

  const reloadData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/estudiante/dashboard/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error al recargar datos:', err);
    }
  };

  const handleCourseSelect = (index) => {
    setSelectedCourseIndex(index);
    setSelectedSubcourseIndex(null);
  };

  const handleSubcourseSelect = (index) => {
    setSelectedSubcourseIndex(index);
  };

  const handleCompletarModulo = async (moduloId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/completar_modulo/${moduloId}/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        // Recargar data para reflejar cambios en progreso
        await reloadData();
      }
    } catch (err) {
      console.error('Error al completar módulo:', err);
    }
  };

  const irAPrueba = () => {
    const selectedCourse = courses[selectedCourseIndex];
    // Asume que la prueba está ligada al curso.
    // Si tienes una URL específica para la prueba del curso, puedes usar navigate a esa ruta.
    // Por ejemplo:
    navigate(`/pruebas?curso_id=${selectedCourse.curso_id}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (courses.length === 0) {
    return <div>Cargando información...</div>;
  }

  const selectedCourse = selectedCourseIndex !== null ? courses[selectedCourseIndex] : null;
  const selectedSubcourse = (selectedCourse && selectedSubcourseIndex !== null) 
    ? selectedCourse.subcursos[selectedSubcourseIndex]
    : null;

  return (
    <div className="estudiante-dashboard">
      <div className="sidebar-cursos">
        <h3>Mis Cursos</h3>
        <ul>
          {courses.map((c, i) => (
            <li
              key={c.curso_id}
              className={selectedCourseIndex === i ? 'selected' : ''}
              onClick={() => handleCourseSelect(i)}
            >
              {c.titulo} ({c.progresoCurso}%)
            </li>
          ))}
        </ul>
      </div>

      <div className="contenido-central">
        {selectedCourse && (
          <>
            <h2>{selectedCourse.titulo}</h2>
            <p>{selectedCourse.descripcion}</p>
            <p>Progreso del curso: {selectedCourse.progresoCurso}%</p>
            {selectedCourse.puedeHacerPrueba && (
              <button className="primary" onClick={irAPrueba}>Ir a la Prueba</button>
            )}

            <div className="subcursos-section">
              <h4>Subcursos</h4>
              <ul>
                {selectedCourse.subcursos.map((sc, idx) => (
                  <li
                    key={sc.subcurso_id}
                    className={selectedSubcourseIndex === idx ? 'selected' : ''}
                    onClick={() => handleSubcourseSelect(idx)}
                  >
                    {sc.nombre} ({sc.progresoSubcurso}%)
                  </li>
                ))}
              </ul>
            </div>

            {selectedSubcourse && (
              <div className="modulos-section">
                <h4>Módulos de {selectedSubcourse.nombre}</h4>
                <ul>
                  {selectedSubcourse.modulos.map(m => (
                    <li key={m.id} className={m.completado ? 'completado' : ''}>
                      <div className="modulo-info">
                        {m.nombre}
                        {m.enlace && <a href={m.enlace} target="_blank" rel="noopener noreferrer">Ver</a>}
                        {m.archivo && <a href={m.archivo} download>Descargar</a>}
                      </div>
                      {!m.completado && (
                        <button onClick={() => handleCompletarModulo(m.id)}>Marcar como Completo</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EstudianteDashboard;
