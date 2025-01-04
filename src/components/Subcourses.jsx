import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Subcourses.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Subcourses = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [subcourses, setSubcourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [expandedSubcourse, setExpandedSubcourse] = useState(null);
  const [modules, setModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const studentId = localStorage.getItem('id');
  const token = localStorage.getItem('accessToken');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchSubcourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subcursos/curso/${cursoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al obtener los subcursos.');
      const data = await response.json();
      setSubcourses(data);

      // Fetch progress for each subcourse
      const progressData = {};
      for (const subcourse of data) {
        const progressResponse = await fetch(
          `${API_BASE_URL}/api/estudianteSubcurso/?idEstudiante=${studentId}&idSubcurso=${subcourse.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (progressResponse.ok) {
          const progressInfo = await progressResponse.json();
          progressData[subcourse.id] = progressInfo[0]?.porcentajeCompletado || 0;
        } else {
          progressData[subcourse.id] = 0;
        }
      }
      setProgress(progressData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subcourses or progress:', error);
      setLoading(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cursos/${cursoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al obtener los detalles del curso.');
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchModules = async (subcourseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/modulos/subcurso/${subcourseId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

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

  const handleNext = async (subcourseId, moduleId, isLastModule) => {
    try {
      // Actualizar el estado del módulo
      await fetch(`${API_BASE_URL}/api/estudianteModulo/update-completion/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudiante_id: parseInt(studentId, 10),
          modulo_id: parseInt(moduleId, 10),
          completado: true,
        }),
      });
  
      // Actualizar el progreso del subcurso
      const progressResponse = await fetch(
        `${API_BASE_URL}/api/estudianteSubcurso/?idEstudiante=${studentId}&idSubcurso=${subcourseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (progressResponse.ok) {
        const progressInfo = await progressResponse.json();
        const updatedProgress = progressInfo[0]?.porcentajeCompletado || 0;
        setProgress((prevProgress) => ({
          ...prevProgress,
          [subcourseId]: updatedProgress,
        }));
      }
  
      if (isLastModule) {
        const nextSubcourseIndex = subcourses.findIndex((sc) => sc.id === subcourseId) + 1;
  
        if (nextSubcourseIndex < subcourses.length) {
          fetchModules(subcourses[nextSubcourseIndex].id);
        } else {
          Swal.fire('¡Felicidades!', 'Has completado todos los subcursos.', 'success');
          navigate('/student/courses');
        }
      } else {
        Swal.fire('¡Listo!', 'Módulo completado.', 'success');
      }
    } catch (error) {
      console.error('Error updating module completion:', error);
      Swal.fire('Error', 'No se pudo completar el módulo.', 'error');
    }
  };

  useEffect(() => {
    fetchSubcourses();
    fetchCourseDetails();
  }, [cursoId]);

  if (loading) return <p>Cargando subcursos...</p>;

  return (
    <div className="course-container">
      <div className="course-header">
        <h1>Curso: {course.titulo}</h1>
      </div>

      <div className="subcourses-container">
        {subcourses.map((subcourse) => (
          <div key={subcourse.id} className="subcourse-wrapper">
            <div
              className={`subcourse-card ${
                expandedSubcourse === subcourse.id ? 'expanded' : ''
              }`}
              onClick={() => {
                // Alternar expansión y cargar módulos
                if (expandedSubcourse !== subcourse.id) {
                  fetchModules(subcourse.id);
                }
                setExpandedSubcourse(
                  expandedSubcourse === subcourse.id ? null : subcourse.id
                );
              }}
              
            >
              <h3>{subcourse.nombre}</h3>
              <p>{subcourse.cantidad_modulos} módulos</p>
              {/* Barra de Progreso */}
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progress[subcourse.id] || 0}%`,
                  }}
                >
                  <span className="progress-text">{(progress[subcourse.id] || 0).toFixed(2)}%</span>
                </div>
              </div>
            </div>
            {expandedSubcourse === subcourse.id && (
              <div className="modules-container">
                {modules[subcourse.id]?.map((module, index) => {
                  const isLastModule = index === modules[subcourse.id].length - 1;

                  return (
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
                          ) : module.archivo_url.match(/\.(jpeg|jpg|png|gif|bmp|svg)$/i) ? (
                            <img
                              src={module.archivo_url}
                              alt={`Vista previa de ${module.nombre}`}
                              className="module-image"
                              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                            />
                          ) : (
                            <a href={module.archivo_url} download>
                              Descargar archivo
                            </a>
                          )}
                        </div>
                      )}
                      <button
                        className="next-button"
                        onClick={() =>
                          handleNext(subcourse.id, module.id, isLastModule)
                        }
                      >
                        {isLastModule ? 'Finalizar Subcurso' : 'Siguiente'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subcourses;