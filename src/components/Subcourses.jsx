import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Subcourses.css';

const Subcourses = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [subcourses, setSubcourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [expandedSubcourse, setExpandedSubcourse] = useState(null);
  const [modules, setModules] = useState({});
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem('id');
  const token = localStorage.getItem('accessToken');

  // Fetch Subcourses
  const fetchSubcourses = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/subcursos/curso/${cursoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Error al obtener los subcursos.');
      const data = await response.json();
      setSubcourses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subcourses:', error);
      setLoading(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cursos/${cursoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Error al obtener los detalles del curso.');
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchModules = async (subcourseId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/modulos/subcurso/${subcourseId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Error al obtener los módulos.');
      const data = await response.json();
      setModules((prevModules) => ({
        ...prevModules,
        [subcourseId]: data,
      }));
      setExpandedSubcourse(subcourseId === expandedSubcourse ? null : subcourseId);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleCompleteContent = async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas marcar este contenido como completado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const progressResponse = await fetch(
            `http://127.0.0.1:8000/api/progreso/?estudiante_id=${studentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!progressResponse.ok) throw new Error('Error al obtener progreso.');

          const progressData = await progressResponse.json();
          const progressId = progressData.find((p) => p.curso === parseInt(cursoId)).id;

          await fetch(`http://127.0.0.1:8000/api/progreso/${progressId}/`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contenidoCompletado: true }),
          });

          Swal.fire('¡Completado!', 'El contenido ha sido marcado como completado.', 'success');
          navigate('/student/courses');
        } catch (error) {
          console.error('Error completing content:', error);
          Swal.fire('Error', 'No se pudo completar el contenido.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchSubcourses();
    fetchCourseDetails();
  }, [cursoId]);

  if (loading) return <p>Cargando subcursos...</p>;

  return (
    <div className="course-container">
      {/* Información del curso */}
      <div className="course-header">
        <h1>Curso: {course.titulo}</h1>
      </div>

      {/* Lista de subcursos */}
      <div className="subcourses-container">
        {subcourses.map((subcourse) => (
          <div key={subcourse.id} className="subcourse-wrapper">
            <div
              className={`subcourse-card ${
                expandedSubcourse === subcourse.id ? 'expanded' : ''
              }`}
              onClick={() => fetchModules(subcourse.id)}
            >
              <h3>{subcourse.nombre}</h3>
              <p>{subcourse.cantidad_modulos} módulos</p>
            </div>
            {expandedSubcourse === subcourse.id && (
              <div className="modules-container">
                {modules[subcourse.id]?.map((module) => (
                  <div key={module.id} className="module-card">
                    <h3>{module.nombre}</h3>
                    {module.enlace && (
                      <div className="module-content">
                        {module.enlace.includes('youtube.com/watch?v=') ? (
                          (() => {
                            const videoId = module.enlace.split('v=')[1].split('&')[0];
                            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            return (
                              <iframe
                                src={embedUrl}
                                title={module.nombre}
                                className="module-iframe"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            );
                          })()
                        ) : (
                          <a href={module.enlace} target="_blank" rel="noopener noreferrer">
                            Ver enlace
                          </a>
                        )}
                      </div>
                    )}
                    {module.archivo_url && (
                      <div className="module-content">
                        {module.archivo_url.endsWith('.pdf') ? (
                          <iframe
                            src={module.archivo_url}
                            title={module.nombre}
                            className="module-iframe"
                          ></iframe>
                        ) : (
                          <a href={module.archivo_url} download>
                            Descargar archivo
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón para completar contenido */}
      <button className="complete-button" onClick={handleCompleteContent}>
        Completar Contenido
      </button>
    </div>
  );
};

export default Subcourses;
