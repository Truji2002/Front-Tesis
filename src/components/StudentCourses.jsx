import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCertificate, FaCheckCircle, FaBook } from 'react-icons/fa';
import '../styles/StudentCourses.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudentCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const studentId = localStorage.getItem('id');

      if (!token || !studentId) {
        throw new Error('Información de autenticación faltante.');
      }

      const progressResponse = await fetch(
        `${API_BASE_URL}/api/progreso/?estudiante_id=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!progressResponse.ok) {
        throw new Error('Error al obtener los cursos asignados al estudiante.');
      }

      const progressData = await progressResponse.json();
      const courseIds = progressData.map((item) => item.curso);

      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const coursePromises = courseIds.map((id) =>
        fetch(`${API_BASE_URL}/api/cursos/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error al obtener el curso ${id}: ${text}`);
          }
          return res.json();
        })
      );

      const assignedCourses = await Promise.all(coursePromises);

      const combinedCourses = assignedCourses.map((course) => {
        const progress = progressData.find((item) => item.curso === course.id);
        const processedCourse = {
          ...course,
          progreso: progress ? progress.porcentajeCompletado : 0,
          completado: progress ? progress.completado : false,
          contenidoCompletado: progress ? progress.contenidoCompletado : null,
          prueba_id: course.prueba_id,
          has_prueba: course.has_prueba,
          simulacion: course.simulacion, // Añadir simulación al curso
        };
        return processedCourse;
      });

      setCourses(combinedCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student courses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCourses();
  }, []);

  const handleViewCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const studentId = localStorage.getItem('id');

      if (!token || !studentId) {
        throw new Error('Información de autenticación faltante.');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/certificado/?curso_id=${courseId}&estudiante_id=${studentId}`,
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
    }
  };

  return (
    <div className="student-courses">
      {/* SECCIÓN HÉROE */}
      <div className="hero-section">
        <img
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW9pbG8weXdrbzFmemUzN2Q4ZGZiNjl4d214NHN3Ym5qNGp4OWRlbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6ZsXhBzpoRApBkPK/giphy.webp"
          alt="Bienvenido a Mis Cursos"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Global QHSE</h1>
          <p className="hero-subtitle">Explora y aprende con los cursos en línea</p>
        </div>
      </div>

      {/* LISTA DE CURSOS */}
      <div className="student-courses-container">
        <h2 className="student-courses-title">Mis Cursos</h2>

        {loading ? (
          <div className="student-courses-loading">
            <div className="spinner"></div>
            <p>Cargando cursos...</p>
          </div>
        ) : courses.length > 0 ? (
          <ul className="courses-list">
            {courses.map((course) => {
              const progressBarColor = course.completado ? '#28a745' : '#FFC107';
              return (
                <li className="course-row" key={course.id}>
                  <div className="course-info">
                    <h3 className="course-title">{course.titulo}</h3>
                    {course.simulacion && (
                      <span className="simulation-label">Tiene Simulación</span>
                    )}
                    <p className="course-description">{course.descripcion}</p>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-s"
                        style={{ width: `${course.progreso}%` }}
                        data-progress={course.progreso > 0 ? Math.min(course.progreso, 100) : "0"}
                      >
                        <span className="progress-text">{course.progreso}%</span>
                      </div>
                    </div>
                    <div className="course-buttons">
                      <button
                        className="btn-primary-sc"
                        onClick={() => navigate(`/student/course/${course.id}`)}
                      >
                        <FaBook className="button-icon" />
                        Curso
                      </button>
                      {course.completado && (
                        <button
                          className="btn-green"
                          onClick={() => handleViewCertificate(course.id)}
                        >
                          <FaCertificate className="button-icon" />
                          Certificado
                        </button>
                      )}
                      {course.has_prueba && course.contenidoCompletado && !course.completado && (
                        <button
                          className="btn-orange"
                          onClick={() => navigate(`/student/test/${course.prueba_id}`)}
                        >
                          <FaCheckCircle className="button-icon" />
                          Prueba
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="course-image-container">
                    <img
                      src={course.imagen || 'https://via.placeholder.com/150x100.png?text=Curso'}
                      alt={`Imagen de ${course.titulo}`}
                      className="course-image"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="sin-cursos">No tienes cursos asignados.</p>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
