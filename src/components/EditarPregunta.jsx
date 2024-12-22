import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarPregunta = () => {
  const { pruebaId, preguntaId } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pregunta: '',
    opcionesRespuestas: '', // Podría ser un string separadas por comas
    respuestaCorrecta: '',
    puntajePregunta: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar datos de la pregunta
    const fetchPregunta = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${preguntaId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            pregunta: data.pregunta,
            opcionesRespuestas: data.opcionesRespuestas,
            respuestaCorrecta: data.respuestaCorrecta,
            puntajePregunta: data.puntajePregunta.toString()
          });
        } else {
          setError('No se pudo cargar la pregunta.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      }
    };
    fetchPregunta();
  }, [preguntaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${preguntaId}/`, {
        method: 'PUT',
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
        // Pregunta editada con éxito
        navigate(`/pruebas/${pruebaId}/preguntas`);
      } else {
        const errData = await response.json();
        setError(`Error: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      setError('Error al intentar editar la pregunta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Editar Pregunta {preguntaId} (Prueba {pruebaId})</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pregunta:</label>
          <input
            name="pregunta"
            value={formData.pregunta}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Opciones (separadas por comas):</label>
          <textarea
            name="opcionesRespuestas"
            value={formData.opcionesRespuestas}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Respuesta Correcta:</label>
          <input
            name="respuestaCorrecta"
            value={formData.respuestaCorrecta}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Puntaje:</label>
          <input
            type="number"
            name="puntajePregunta"
            value={formData.puntajePregunta}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditarPregunta;
