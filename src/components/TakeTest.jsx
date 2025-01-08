import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAlert } from './alerts'; // Asegúrate de tener esta función implementada
import Button from './ui/button/Button';
import '../styles/TakeTest.css';

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
      showAlert('Advertencia', 'Por favor, responde todas las preguntas antes de enviar.', 'warning');
      return;
    }
  
    const confirmed = window.confirm('¿Estás seguro de que deseas enviar tus respuestas?');
    if (!confirmed) return;
  
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
      showAlert('Error', 'Problemas de autenticación. Por favor, inicia sesión nuevamente.', 'error');
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
  
      showAlert(
        'Resultados de la Prueba',
        `Calificación: ${scaledScore.toFixed(2)} / 10\n¿Aprobado? ${isApproved ? 'Sí' : 'No'}\nIntentos usados: ${result.intento || 'No disponible'}`,
        'success'
      );
  
      navigate('/student/courses');
    } catch (error) {
      console.error('Error al terminar la prueba:', error);
      showAlert('Error', error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };
   

  // Render loading
  if (loading) return <p>Cargando prueba...</p>;

  return (
    <div className="take-test-container">
      <h2>Tomar Prueba</h2>
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
            {Object.entries(q.opcionesRespuestas || {}).map(([key, value]) => (
              <label key={key}>
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={value}
                  checked={userAnswers[q.id] === value}
                  onChange={() => handleOptionChange(q.id, value)}
                />
                {value}
              </label>
            ))}
          </div>
        ))}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar Respuestas'}
        </Button>
      </form>
    </div>
  );
};

export default TakeTest;
