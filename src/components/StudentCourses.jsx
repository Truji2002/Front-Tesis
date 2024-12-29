import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentCourses.css';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [studentId] = useState(localStorage.getItem('id'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const progressResponse = await fetch(
        `http://127.0.0.1:8000/api/progreso/?estudiante_id=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!progressResponse.ok) {
        throw new Error('Error al obtener el progreso del estudiante.');
      }

      const progressData = await progressResponse.json();

      const courseIds = progressData.map((item) => item.curso);
      const coursesResponse = await fetch(
        `http://127.0.0.1:8000/api/cursos/?ids=${courseIds.join(',')}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!coursesResponse.ok) {
        throw new Error('Error al obtener los detalles de los cursos.');
      }

      const coursesData = await coursesResponse.json();

      const coursesWithProgress = coursesData.map((course) => {
        const progress = progressData.find((p) => p.curso === course.id);
        return {
          ...course,
          progreso: progress ? progress.porcentajeCompletado : 0,
          completado: progress ? progress.completado : false,
        };
      });

      setCourses(coursesWithProgress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [studentId]);

  const handleViewCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const studentId = localStorage.getItem('id');

      const response = await fetch(
        `http://127.0.0.1:8000/api/certificado/?curso_id=${courseId}&estudiante_id=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('No se pudo obtener el certificado.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado_Curso_${courseId}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el certificado:', error);
      alert('No se pudo descargar el certificado.');
    }
  };

  if (loading) {
    return <p>Cargando cursos...</p>;
  }

  return (
    <div className="student-courses-container">
      <h2 className="student-courses-title">Mis Cursos</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div
            className={`course-card ${course.completado ? 'completed' : 'in-progress'}`}
            key={course.id}
          >
            <img
              src={course.imagen || 'default-image.jpg'}
              alt={`Imagen de ${course.titulo}`}
              className="course-image"
            />
            <h3 className="course-title">{course.titulo}</h3>
            <p className="course-description">{course.descripcion}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${course.progreso}%` }}
              >
                <span className="progress-text">{course.progreso.toFixed(2)}%</span>

              </div>
            </div>
            <div className="course-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate(`/student/course/${course.id}`)}
              >
                Ir al Curso
              </button>
              {course.completado && (
                <button
                  className="btn-secondary"
                  onClick={() => handleViewCertificate(course.id)}
                >
                  Ver Certificado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;
