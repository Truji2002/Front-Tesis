import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearPrueba = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    curso: '',
    duracion: '',
    estaAprobado: false,
    calificacion: '',
    fechaEvaluacion: '',
    preguntas: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    pregunta: '',
    opcionesRespuestas: '',
    respuestaCorrecta: '',
    puntajePregunta: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/cursos/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if(response.ok) {
          const data = await response.json();
          setCursos(data);
        } else {
          setError('No se pudieron cargar los cursos.');
        }
      } catch(err) {
        setError('Error al conectar con el servidor.');
      }
    };
    fetchCursos();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({...currentQuestion, [name]: value});
  };

  const agregarPregunta = () => {
    if (currentQuestion.pregunta && currentQuestion.opcionesRespuestas && currentQuestion.respuestaCorrecta && currentQuestion.puntajePregunta) {
      setFormData({
        ...formData,
        preguntas: [...formData.preguntas, currentQuestion]
      });
      setCurrentQuestion({
        pregunta: '',
        opcionesRespuestas: '',
        respuestaCorrecta: '',
        puntajePregunta: ''
      });
    } else {
      setError("Por favor completa todos los campos de la pregunta antes de agregarla.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pruebas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          curso: parseInt(formData.curso),
          duracion: parseInt(formData.duracion),
          estaAprobado: formData.estaAprobado,
          calificacion: parseFloat(formData.calificacion),
          fechaEvaluacion: formData.fechaEvaluacion,
          preguntas: formData.preguntas
        })
      });

      if(response.ok) {
        // Prueba creada con éxito, junto con sus preguntas
        navigate('/pruebas');
      } else {
        const errData = await response.json();
        setError(`Error: ${JSON.stringify(errData)}`);
      }
    } catch(err) {
      setError('Error al intentar crear la prueba.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Prueba</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Curso:</label>
          <select name="curso" value={formData.curso} onChange={handleChange} required>
            <option value="">Selecciona un curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.titulo}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Duración (min):</label>
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Calificación:</label>
          <input
            type="number"
            step="0.1"
            name="calificacion"
            value={formData.calificacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Evaluación:</label>
          <input
            type="date"
            name="fechaEvaluacion"
            value={formData.fechaEvaluacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="estaAprobado"
              checked={formData.estaAprobado}
              onChange={handleChange}
            />
            ¿Está aprobada por defecto?
          </label>
        </div>

        <h3>Agregar Preguntas</h3>
        <div className="form-group">
          <label>Pregunta:</label>
          <input
            name="pregunta"
            value={currentQuestion.pregunta}
            onChange={handleQuestionChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Opciones (separadas por comas):</label>
          <textarea
            name="opcionesRespuestas"
            value={currentQuestion.opcionesRespuestas}
            onChange={handleQuestionChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Respuesta Correcta:</label>
          <input
            name="respuestaCorrecta"
            value={currentQuestion.respuestaCorrecta}
            onChange={handleQuestionChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Puntaje:</label>
          <input
            type="number"
            name="puntajePregunta"
            value={currentQuestion.puntajePregunta}
            onChange={handleQuestionChange}
            required
          />
        </div>

        <button type="button" onClick={agregarPregunta}>Agregar Pregunta a la Prueba</button>

        <h4>Preguntas agregadas:</h4>
        <ul>
          {formData.preguntas.map((p, index) => (
            <li key={index}>{p.pregunta} - Puntaje: {p.puntajePregunta}</li>
          ))}
        </ul>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Prueba con Preguntas'}
        </button>
      </form>
    </div>
  );
};

export default CrearPrueba;
