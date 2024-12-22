import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ListaPreguntas = () => {
  const { pruebaId } = useParams(); // Asumiendo que pasas el ID de la prueba en la ruta
  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/preguntas/?prueba=${pruebaId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPreguntas(data);
        } else {
          setError('No se pudieron cargar las preguntas.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      }
    };
    fetchPreguntas();
  }, [pruebaId]);

  return (
    <div>
      <h2>Preguntas de la Prueba {pruebaId}</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {preguntas.map(p => (
          <li key={p.id}>{p.pregunta} - Puntaje: {p.puntajePregunta}</li>
        ))}
      </ul>
      <button onClick={() => navigate(`/pruebas/${pruebaId}/preguntas/create`)}>Crear Pregunta</button>
      <button onClick={() => navigate(`/pruebas/${pruebaId}/preguntas/${pregunta.id}/edit`)}>Editar</button>

    </div>
  );
};

const eliminarPregunta = async (idPregunta) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preguntas/${idPregunta}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        setPreguntas(preguntas.filter(p => p.id !== idPregunta));
      } else {
        setError('No se pudo eliminar la pregunta.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };
  

export default ListaPreguntas;
