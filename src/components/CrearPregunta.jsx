import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CrearPregunta = () => {
  const { pruebaId } = useParams();
  const [formData, setFormData] = useState({
    pregunta: '',
    opcionesRespuestas: '', // Podrías usar textarea con opciones separadas por comas
    respuestaCorrecta: '',
    puntajePregunta: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/preguntas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          prueba: parseInt(pruebaId),
          pregunta: formData.pregunta,
          opcionesRespuestas: formData.opcionesRespuestas,
          respuestaCorrecta: formData.respuestaCorrecta,
          puntajePregunta: parseInt(formData.puntajePregunta)
        })
      });
      if (response.ok) {
        // Pregunta creada con éxito
        navigate(`/pruebas/${pruebaId}/preguntas`); // Ruta donde listas las preguntas de esa prueba
      } else {
        const errData = await response.json();
        setError(`Error: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      setError('Error al intentar crear la pregunta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Pregunta para la Prueba {pruebaId}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pregunta:</label>
          <input name="pregunta" value={formData.pregunta} onChange={handleChange} required />
        </div>
        <div>
          <label>Opciones (separadas por comas):</label>
          <textarea name="opcionesRespuestas" value={formData.opcionesRespuestas} onChange={handleChange} required />
        </div>
        <div>
          <label>Respuesta Correcta:</label>
          <input name="respuestaCorrecta" value={formData.respuestaCorrecta} onChange={handleChange} required />
        </div>
        <div>
          <label>Puntaje:</label>
          <input type="number" name="puntajePregunta" value={formData.puntajePregunta} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Pregunta'}</button>
      </form>
    </div>
  );
};

export default CrearPregunta;
