import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/Subcourses.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Subcourses = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [subcourses, setSubcourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState({});
  const [selectedSubcourse, setSelectedSubcourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [globalProgress, setGlobalProgress] = useState(0); // Progreso global de capacitación
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('id');
  const token = localStorage.getItem('accessToken');

  // Calcular progreso global basado en módulos completados
  const calculateGlobalProgress = async () => {
    try {
      let totalModules = 0;
      let completedModulesCount = 0;

      for (const subcourse of subcourses) {
        const subcourseModules = modules[subcourse.id] || [];
        totalModules += subcourseModules.length;
        completedModulesCount += (completedModules[subcourse.id] || []).filter(Boolean).length;
      }

      const progress = totalModules > 0 ? (completedModulesCount / totalModules) * 100 : 0;
      setGlobalProgress(progress);
    } catch (error) {
      console.error('Error calculating global progress:', error);
    }
  };

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
    } catch (error) {
      console.error('Error fetching subcourses:', error);
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

      setModules((prev) => ({
        ...prev,
        [subcourseId]: data,
      }));

      setCompletedModules((prev) => ({
        ...prev,
        [subcourseId]: data.map((module) => module.completado || false),
      }));

      setSelectedSubcourse(subcourseId);
      setSelectedModule(data[0] || null);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleNext = async (subcourseId, module, index, isLastModule) => {
    try {
      await fetch(`${API_BASE_URL}/api/estudianteModulo/update-completion/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudiante_id: parseInt(studentId, 10),
          modulo_id: parseInt(module.id, 10),
          completado: true,
        }),
      });

      // Actualizar estado local
      setCompletedModules((prev) => ({
        ...prev,
        [subcourseId]: prev[subcourseId].map((completed, idx) =>
          idx === index ? true : completed
        ),
      }));

      // Recalcular progreso global
      calculateGlobalProgress();

      if (isLastModule) {
        const currentIndex = subcourses.findIndex((sc) => sc.id === subcourseId);
        const nextIndex = currentIndex + 1;
        if (nextIndex < subcourses.length) {
          const nextSub = subcourses[nextIndex];
          if (!modules[nextSub.id]) {
            await fetchModules(nextSub.id);
          }
          setSelectedSubcourse(nextSub.id);
          setSelectedModule(modules[nextSub.id]?.[0] || null);
        } else {
          Swal.fire('¡Excelente!', 'Has completado todos los subcursos.', 'success');
          navigate('/student/courses');
        }
      } else {
        const nextModule = modules[subcourseId][index + 1];
        setSelectedModule(nextModule);
      }
    } catch (error) {
      console.error('Error updating module completion:', error);
      Swal.fire('Error', 'No se pudo completar el módulo.', 'error');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchSubcourses();
      await fetchCourseDetails();
      setLoading(false);
    })();
  }, [cursoId]);

  useEffect(() => {
    calculateGlobalProgress();
  }, [modules, completedModules]);

  if (loading) return <p>Cargando subcursos...</p>;

  return (
    <div className="course-main-container">
      <div className="course-topbar">
        <div>
          <h2>{course?.titulo || 'Detalles del Curso'}</h2>
          <p>{course?.descripcion}</p>
        </div>
        <div className="global-progress-container">
          <span>Progreso global de la capacitación</span>
          <div className="global-progress-bar">
            <div
              className="global-progress-fill"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
          <span className="global-progress-percent">{globalProgress.toFixed(2)}%</span>
        </div>
      </div>

      <div className="course-content-container">
        <div className="course-sidebar">
          {subcourses.map((subcourse) => {
            const isSelectedSubcourse = selectedSubcourse === subcourse.id;
            return (
              <div key={subcourse.id} className="sidebar-subcourse">
                <div
                  className={`sidebar-subcourse-header ${isSelectedSubcourse ? 'active' : ''}`}
                  onClick={() => {
                    if (!modules[subcourse.id]) {
                      fetchModules(subcourse.id);
                    } else {
                      setSelectedSubcourse(
                        isSelectedSubcourse ? null : subcourse.id
                      );
                    }
                  }}
                >
                  <h3>{subcourse.nombre}</h3>
                  <p>{subcourse.cantidad_modulos} módulos</p>
                </div>

                {isSelectedSubcourse && modules[subcourse.id] && (
                  <ul className="sidebar-module-list">
                    {modules[subcourse.id].map((module, idx) => {
                      const isActiveModule = selectedModule?.id === module.id;
                      const isCompleted = completedModules[subcourse.id]?.[idx] || false;
                      return (
                        <li
                          key={module.id}
                          className={`sidebar-module-item ${isActiveModule ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModule(module);
                          }}
                        >
                          <span>{module.nombre}</span>
                          {isCompleted && <FaCheckCircle className="module-completed-icon" />}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="course-details-panel">
          {selectedModule ? (
            <div className="module-detail">
              <h3>{selectedModule.nombre}</h3>
              <div className="module-media-container">
                {selectedModule.enlace && selectedModule.enlace.includes('youtube.com/watch?v=') && (
                  <div className="media-wrapper">
                    <h4>Video:</h4>
                    {(() => {
                      const videoId = selectedModule.enlace.split('v=')[1].split('&')[0];
                      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      return (
                        <iframe
                          src={embedUrl}
                          title={selectedModule.nombre}
                          className="module-iframe"
                          allowFullScreen
                        />
                      );
                    })()}
                  </div>
                )}

                {selectedModule.archivo_url && selectedModule.archivo_url.endsWith('.pdf') && (
                  <div className="media-wrapper">
                    <h4>Documento PDF:</h4>
                    <iframe
                      src={selectedModule.archivo_url}
                      title={selectedModule.nombre}
                      className="module-iframe"
                    ></iframe>
                  </div>
                )}
                {selectedModule.archivo_url &&
                  selectedModule.archivo_url.match(/\.(jpeg|jpg|png|gif|bmp|svg)$/i) && (
                    <div className="media-wrapper">
                      <h4>Imagen:</h4>
                      <img
                        src={selectedModule.archivo_url}
                        alt={`Vista previa de ${selectedModule.nombre}`}
                        className="module-image"
                      />
                    </div>
                  )}
              </div>

              <button
                className="next-button"
                onClick={() => {
                  const subcourseModules = modules[selectedSubcourse];
                  const currentIndex = subcourseModules.findIndex((m) => m.id === selectedModule.id);
                  const isLast = currentIndex === subcourseModules.length - 1;
                  handleNext(selectedSubcourse, selectedModule, currentIndex, isLast);
                }}
              >
                {(() => {
                  const subcourseModules = modules[selectedSubcourse];
                  const currentIndex = subcourseModules.findIndex((m) => m.id === selectedModule.id);
                  const isLast = currentIndex === subcourseModules.length - 1;
                  return isLast ? 'Finalizar Subcurso' : 'Siguiente';
                })()}
              </button>
            </div>
          ) : (
            <div className="no-module-selected">
              <p>Selecciona un módulo para ver su contenido.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subcourses;
