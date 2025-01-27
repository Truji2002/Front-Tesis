import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAlert } from './alerts'; // Asegúrate de tener esta función implementada
import Button from './ui/button/button';
import '../styles/TakeTest.css';
import Swal from 'sweetalert2'; // Asegúrate de importar SweetAlert2

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const TakeTest = () => {
  const { pruebaId } = useParams();
  const navigate = useNavigate();

  const [prueba, setPrueba] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchPrueba();
  }, [pruebaId]);

  // Fetch prueba data
  const fetchPrueba = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token de autenticación no encontrado.');
  
      const response = await fetch(`${API_BASE_URL}/api/pruebas/${pruebaId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) throw new Error(`Error al obtener la prueba: ${response.statusText}`);
  
      const data = await response.json();
      setPrueba(data);
      setQuestions(data.preguntas || []);
      setTimeLeft(data.duracion ? data.duracion * 60 : null); // Duración en segundos
      
      // Solicita los detalles del curso para obtener el título
      if (data.curso) {
        const courseResponse = await fetch(`${API_BASE_URL}/api/cursos/${data.curso}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!courseResponse.ok) throw new Error('Error al obtener el título del curso.');
  
        const courseData = await courseResponse.json();
        setPrueba((prev) => ({
          ...prev,
          curso_titulo: courseData.titulo,
        }));
      }
    } catch (error) {
      console.error('Error fetching prueba:', error);
      showAlert('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  

  // Timer logic
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time runs out
      return;
    }

    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Handle option selection
  const handleOptionChange = (questionId, chosenOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: chosenOption,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (submitting) return;
  
    // Validar que todas las preguntas hayan sido respondidas
    if (Object.keys(userAnswers).length < questions.length) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Por favor, responde todas las preguntas antes de enviar.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }
  
    // Confirmar antes de enviar respuestas
    const confirmed = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que deseas enviar tus respuestas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    });
  
    if (!confirmed.isConfirmed) return;
  
    setSubmitting(true);
  
    let totalPossibleScore = 0; // Puntaje total posible
    let obtainedScore = 0; // Puntaje obtenido por el estudiante
  
    questions.forEach((q) => {
      const correctAnswer = q.respuestaCorrecta?.trim()?.toLowerCase();
      const chosenAnswer = userAnswers[q.id]?.trim()?.toLowerCase();
  
      // Sumar el puntaje de la pregunta al puntaje total posible
      totalPossibleScore += q.puntajePregunta;
  
      // Si la respuesta es correcta, sumar el puntaje al puntaje obtenido
      if (chosenAnswer === correctAnswer) {
        obtainedScore += q.puntajePregunta;
      }
    });
  
    // Escalar la calificación a 10
    const scaledScore = (obtainedScore / totalPossibleScore) * 10;
    const passingScore = 7; // Mínimo 7/10 para aprobar
    const isApproved = scaledScore >= passingScore;
  
    const token = localStorage.getItem('accessToken');
    const studentId = parseInt(localStorage.getItem('id'), 10);
  
    if (!token || isNaN(studentId)) {
      Swal.fire({
        title: 'Error',
        text: 'Problemas de autenticación. Por favor, inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      setSubmitting(false);
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/actualizar-prueba/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudiante_id: studentId,
          prueba_id: parseInt(pruebaId, 10),
          estaAprobado: isApproved,
          calificacion: scaledScore.toFixed(2), // Calificación escalada a 2 decimales
        }),
      });
  
      const text = await response.text();
      if (!response.ok) {
        const errorMsg = JSON.parse(text).error || 'Error al actualizar la prueba.';
        throw new Error(errorMsg);
      }
  
      const result = JSON.parse(text);
  
      Swal.fire({
        title: 'Resultados de la Prueba',
        html: `
          <strong>Calificación:</strong> ${scaledScore.toFixed(2)} / 10<br>
          <strong>¿Aprobado?:</strong> ${isApproved ? 'Sí' : 'No'}<br>
          
        `,
        icon: isApproved ? 'success' : 'error', // Icono dinámico según el resultado
        confirmButtonText: 'Finalizar',
      });
  
      navigate('/student/courses');
    } catch (error) {
      console.error('Error al terminar la prueba:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setSubmitting(false);
    }
  };
   

  // Render loading
  if (loading) return <p>Cargando prueba...</p>;

  return (
    <div className="take-test-container">
      <h2>Prueba</h2>
      {prueba && <h3>{prueba.curso_titulo || `Prueba ID: ${prueba.id}`}</h3>}
      {timeLeft !== null && (
        <p>
          Tiempo restante: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q.id} className="question-card">
            <p>
              Pregunta {idx + 1}: {q.pregunta}
            </p>
            <div className="options-container">
              {Object.entries(q.opcionesRespuestas || {}).map(([key, value]) => (
                <label key={key} className="option-label">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={value}
                    checked={userAnswers[q.id] === value}
                    onChange={() => handleOptionChange(q.id, value)}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="button-container">
          <Button className="submit-btn" type="submit" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar Respuestas'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TakeTest;
